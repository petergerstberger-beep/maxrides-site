#!/usr/bin/env python3
"""
Regenerate tight frame-only masks for the bike viewer.

The original frame masks were "everything-not-tire-tread" — they included the
seat, fork tubes, wheel hubs, and spokes, so when the viewer applies a color
tint, all of those leak. This script builds a tighter mask by starting from
the cutout and subtracting:

  1. The wheels mask (full disc) — kills hubs/spokes/rims.
  2. Very dark pixels (luminance < 0.18) — tires, seat fabric, suspension
     dampers, chain, gripper texture.
  3. Very bright metallic pixels (luminance > 0.86 in low-saturation) —
     chrome fork tubes, polished swingarm.

Then a slight binary erosion smooths out single-pixel noise around the edges.

Inputs (per bike `<slug>`):
  - assets/img/bikes/cut/<slug>.webp                (transparent cutout)
  - assets/img/bikes/masks/<slug>-wheels.webp       (wheels-disc mask)

Output:
  - assets/img/bikes/masks/<slug>-frame.webp        (overwritten — tight)

Run from repo root:
    python3 scripts/regen-frame-masks.py
"""

import sys
from pathlib import Path

from PIL import Image, ImageFilter
import numpy as np

REPO = Path(__file__).resolve().parent.parent
CUT_DIR = REPO / "assets/img/bikes/cut"
MASK_DIR = REPO / "assets/img/bikes/masks"

SLUGS = [
    "sur-ron-light-bee-x",
    "sur-ron-ultra-bee",
    "talaria-dragon",
    "talaria-sting-mx4",
    "stark-varg",
    "etm-rtr-xl",
    "etm-rtr-sport",
    "etm-rtr-lite",
    "rawrr-mantis",
    "super73-rx",
    "super73-zx",
    "onyx-rcr",
    "super73-zx-le-speedway",
]


def rgb_to_hsl_arrays(rgb):
    """Vectorized RGB(0-1) -> HSL(0-1). Returns (h, s, l) arrays."""
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    mx = np.maximum(np.maximum(r, g), b)
    mn = np.minimum(np.minimum(r, g), b)
    l = (mx + mn) / 2.0
    d = mx - mn
    s = np.where(d == 0, 0.0, np.where(l > 0.5, d / (2.0 - mx - mn + 1e-9), d / (mx + mn + 1e-9)))
    return s, l  # we don't need h


def largest_connected_component(binary):
    """Return only the largest connected component of a 2D binary array.
    Vectorized flood-fill via iterative dilation against the input mask —
    starts from the largest single seed and grows until convergence."""
    h, w = binary.shape
    if not binary.any():
        return binary

    # Find row,col of the densest 16x16 cell — that's the seed for the biggest component.
    # Downsample by integer division, sum, argmax.
    coarse = binary[::4, ::4]
    ys, xs = np.nonzero(coarse)
    if len(ys) == 0:
        return binary
    # Pick the centroid of all set pixels as the seed.
    sy = int(ys.mean()) * 4
    sx = int(xs.mean()) * 4
    if not binary[sy, sx]:
        # centroid landed in a hole — find nearest set pixel
        candidates = np.argwhere(binary)
        sy, sx = candidates[len(candidates) // 2]

    # BFS flood fill via PIL ImageDraw.floodfill on a PIL image
    pil = Image.fromarray((binary.astype(np.uint8)) * 255, mode="L")
    # Convert to mode "1" then back so floodfill is cheap
    from PIL import ImageDraw  # noqa: F401  (ensures import succeeds)
    # Use np-based flood: iteratively dilate the seed mask AND with binary until stable.
    seed = np.zeros_like(binary, dtype=bool)
    seed[sy, sx] = True
    # Quick dilate: shift in 4 cardinal dirs, OR, AND with binary, repeat until no change.
    # Limit iterations to avoid pathological cases.
    for _ in range(400):
        prev_sum = seed.sum()
        seed_up    = np.zeros_like(seed); seed_up[1:, :]  = seed[:-1, :]
        seed_down  = np.zeros_like(seed); seed_down[:-1, :] = seed[1:, :]
        seed_left  = np.zeros_like(seed); seed_left[:, 1:]  = seed[:, :-1]
        seed_right = np.zeros_like(seed); seed_right[:, :-1] = seed[:, 1:]
        seed = (seed | seed_up | seed_down | seed_left | seed_right) & binary
        if seed.sum() == prev_sum:
            break
    return seed


def build_frame_mask(slug):
    """Return a tight binary frame mask as a uint8 array (0 or 255)."""
    cut_path = CUT_DIR / f"{slug}.webp"
    wheels_path = MASK_DIR / f"{slug}-wheels.webp"

    cut = Image.open(cut_path).convert("RGBA")
    arr = np.asarray(cut, dtype=np.float32) / 255.0
    h, w = arr.shape[:2]

    # 1. Start from cutout alpha — anywhere the bike has pixels.
    bike_alpha = arr[..., 3] > 0.5

    # 2. Subtract wheels mask if available.
    wheels_mask = None
    if wheels_path.exists():
        wheels_img = Image.open(wheels_path).convert("RGBA")
        if wheels_img.size != cut.size:
            wheels_img = wheels_img.resize(cut.size, Image.BILINEAR)
        wheels_alpha = np.asarray(wheels_img, dtype=np.float32)[..., 3] / 255.0
        wheels_mask = wheels_alpha > 0.5

    rgb = arr[..., :3]
    sat, lum = rgb_to_hsl_arrays(rgb)

    # 3. Drop dark pixels (tires, seat, chain, dampers). Bumped from 0.18 to 0.22
    #    to also catch dark-grey seat fabric.
    too_dark = lum < 0.22

    # 4. Drop bright low-saturation pixels (chrome forks, polished metal).
    too_chrome = (lum > 0.86) & (sat < 0.18)

    # 5. Drop the bottom strip of the image — bikes' ground shadows can have
    #    luminance that falls within the frame range. The bike body never
    #    extends below ~88% of the image height in our cutouts.
    y_idx = np.arange(h)[:, None] / h
    bottom_strip = (y_idx > 0.88)

    frame = bike_alpha & ~too_dark & ~too_chrome & ~bottom_strip
    if wheels_mask is not None:
        frame = frame & ~wheels_mask

    # Convert to PIL grayscale once
    out = (frame.astype(np.uint8)) * 255
    img = Image.fromarray(out)

    # Morphological close (dilate then erode) to fill small gaps in the
    # frame caused by speculars/dark dividers (e.g., a panel seam).
    img = img.filter(ImageFilter.MaxFilter(3))
    img = img.filter(ImageFilter.MinFilter(3))
    # Then open (erode then dilate) to clean isolated noise pixels.
    img = img.filter(ImageFilter.MinFilter(3))
    img = img.filter(ImageFilter.MaxFilter(3))

    return img


def save_mask_webp(mask_l, slug):
    """Save as RGBA WebP where alpha = mask, RGB = white (so mask-image-luminance
    fallbacks also work)."""
    w, h = mask_l.size
    rgb = Image.new("RGB", (w, h), (255, 255, 255))
    out = Image.merge("RGBA", (*rgb.split(), mask_l))
    out_path = MASK_DIR / f"{slug}-frame.webp"
    out.save(out_path, "WEBP", quality=85, method=6, lossless=False)
    return out_path


def main():
    print(f"Regenerating frame masks for {len(SLUGS)} bikes...\n")
    for slug in SLUGS:
        try:
            mask = build_frame_mask(slug)
            arr = np.asarray(mask)
            pct = (arr > 127).sum() / arr.size * 100
            out_path = save_mask_webp(mask, slug)
            rel = out_path.relative_to(REPO)
            print(f"  {slug:30s} {pct:5.1f}% mask coverage  ->  {rel}")
        except Exception as e:
            print(f"  {slug:30s} ERROR: {e}", file=sys.stderr)


if __name__ == "__main__":
    main()

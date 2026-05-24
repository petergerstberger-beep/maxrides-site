/* ============================================
   MaxRides — Shared client utilities
   Reveal-on-scroll, year stamp, bike hydration.
   ============================================ */

(function () {
  'use strict';

  // -- Reveal-on-scroll using IntersectionObserver --------------
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  // -- Bike hydration: <div data-bike="dirt-01" data-accent="#FF5A1F"> -
  function initBikes() {
    if (!window.BIKE_SVG) return;
    var stages = document.querySelectorAll('[data-bike]');
    stages.forEach(function (el) {
      var slug = el.getAttribute('data-bike');
      var accent = el.getAttribute('data-accent') || '#FF5A1F';
      if (window.BIKE_SVG[slug]) {
        el.innerHTML = window.BIKE_SVG[slug](accent);
      }
    });
  }

  // -- Year stamp ------------------------------------------------
  function initYear() {
    var year = new Date().getFullYear();
    document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = year; });
  }

  // -- Cart badge: read localStorage cart and show count ---------
  function initCartBadge() {
    var badges = document.querySelectorAll('[data-cart-count]');
    if (!badges.length) return;
    var raw = localStorage.getItem('maxrides.cart');
    var cart = raw ? JSON.parse(raw) : [];
    var count = cart.reduce(function (sum, item) { return sum + (item.qty || 1); }, 0);
    badges.forEach(function (b) {
      b.textContent = count > 0 ? String(count) : '';
      b.classList.toggle('is-empty', count === 0);
    });
  }

  // -- Wire it all up on DOM ready -------------------------------
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    initBikes();
    initReveal();
    initYear();
    initCartBadge();
  });

  // Expose a tiny event bus for other pages to refresh state
  window.MAXRIDES = window.MAXRIDES || {};
  window.MAXRIDES.refreshCartBadge = initCartBadge;
})();

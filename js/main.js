/* ============================================================
   MAIN — sapna-sarees/js/main.js
   Navbar behaviour, smooth scroll, reveal animations,
   mobile menu, and miscellaneous interactions.
   ============================================================ */

(function () {
  'use strict';

  /* ── Navbar: scroll behaviour ── */
  var navbar = document.getElementById('navbar');

  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); /* run once on load */

  /* ── Smooth scroll for anchor links ── */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    var navH = navbar ? navbar.offsetHeight : 0;
    var top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top: top, behavior: 'smooth' });
    /* Close mobile menu if open */
    closeMobileMenu();
  });

  /* ── Mobile hamburger menu ── */
  var hamburger  = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');

  function openMobileMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!hamburger) return;
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      if (mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  /* Close mobile menu on Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobileMenu();
  });

  /* ── Intersection Observer: reveal animations ── */
  var revealEls = document.querySelectorAll('.reveal-up, .reveal-right');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    /* Fallback for old browsers: show everything immediately */
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* Also observe dynamically added cards after renderers run */
  window.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
      var dynamicEls = document.querySelectorAll(
        '.collection-card, .product-card, .value-card'
      );
      dynamicEls.forEach(function (el) {
        el.classList.add('reveal-up');
        if ('IntersectionObserver' in window) {
          observer.observe(el);
        } else {
          el.classList.add('in-view');
        }
      });
    }, 100);
  });

  /* ── Active nav link on scroll ── */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.navbar__link');

  function activateNavLink() {
    var scrollY = window.scrollY;
    sections.forEach(function (section) {
      var top    = section.offsetTop - 100;
      var bottom = top + section.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(function (link) {
          link.style.opacity = (link.getAttribute('href') === '#' + section.id) ? '1' : '';
        });
      }
    });
  }

  window.addEventListener('scroll', activateNavLink, { passive: true });

  /* ── Lazy load: swap placeholder images when added ── */
  /* If you add <img data-src="..."> elements, they auto-load on scroll */
  var lazyImgs = document.querySelectorAll('img[data-src]');
  if (lazyImgs.length && 'IntersectionObserver' in window) {
    var imgObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          imgObserver.unobserve(img);
        }
      });
    });
    lazyImgs.forEach(function (img) { imgObserver.observe(img); });
  }

})();

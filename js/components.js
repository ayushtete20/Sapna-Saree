/* ============================================================
   COMPONENTS — sapna-sarees/js/components.js
   Renders all dynamic sections from window.DATA objects.
   ============================================================ */

/* ── Helper: build WhatsApp URL ── */
function waUrl(msg) {
  return 'https://wa.me/' + window.WA_NUMBER + '?text=' + encodeURIComponent(msg);
}

/* ── Render: Collections ── */
function renderCollections() {
  var el = document.getElementById('collectionsGrid');
  if (!el) return;
  el.innerHTML = window.COLLECTIONS.map(function(c, i) {
    return [
      '<div class="collection-card reveal-up" style="animation-delay:' + (i * 0.06) + 's">',
        '<div class="collection-card__gold-top" aria-hidden="true"></div>',
        '<div class="collection-card__header">',
          '<h3 class="collection-card__name">', c.name, '</h3>',
          '<span class="collection-card__count">', c.count, '</span>',
        '</div>',
        '<p class="collection-card__desc">', c.desc, '</p>',
        '<div class="collection-card__arrow" aria-hidden="true">',
          '<span>Explore</span>',
          '<div class="collection-card__arrow-line"></div>',
        '</div>',
      '</div>'
    ].join('');
  }).join('');
}

/* ── Render: Products ── */
function renderProducts() {
  var el = document.getElementById('productsGrid');
  if (!el) return;
  el.innerHTML = window.PRODUCTS.map(function(p) {
    var waMsg = 'Hi, I\'m interested in the ' + p.name + '. Could you share more details?';
    return [
      '<article class="product-card" data-id="' + p.id + '">',
        '<div class="product-card__swatch" style="background:' + p.hue + '">',
          '<svg viewBox="0 0 480 360" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">',
            '<line x1="0" y1="44"  x2="480" y2="44"  stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/>',
            '<line x1="0" y1="88"  x2="480" y2="88"  stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/>',
            '<line x1="0" y1="132" x2="480" y2="132" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/>',
            '<line x1="0" y1="176" x2="480" y2="176" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/>',
            '<line x1="0" y1="220" x2="480" y2="220" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/>',
            '<line x1="0" y1="264" x2="480" y2="264" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/>',
            '<line x1="0" y1="308" x2="480" y2="308" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/>',
            '<line x1="44"  y1="0" x2="44"  y2="360" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/>',
            '<line x1="88"  y1="0" x2="88"  y2="360" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/>',
            '<line x1="132" y1="0" x2="132" y2="360" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/>',
            '<line x1="176" y1="0" x2="176" y2="360" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/>',
            '<line x1="220" y1="0" x2="220" y2="360" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/>',
            '<line x1="264" y1="0" x2="264" y2="360" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/>',
            '<line x1="308" y1="0" x2="308" y2="360" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/>',
            '<line x1="352" y1="0" x2="352" y2="360" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/>',
            '<line x1="396" y1="0" x2="396" y2="360" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/>',
            '<line x1="440" y1="0" x2="440" y2="360" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/>',
            '<ellipse cx="240" cy="180" rx="110" ry="145" fill="rgba(255,255,255,0.05)"/>',
            '<rect x="20" y="20" width="440" height="320" fill="none" stroke="#B8924A" stroke-width="0.5" stroke-opacity="0.4"/>',
            '<rect x="30" y="30" width="420" height="300" fill="none" stroke="#B8924A" stroke-width="0.25" stroke-opacity="0.2"/>',
            '<circle cx="30"  cy="30"  r="3.5" fill="#B8924A" fill-opacity="0.45"/>',
            '<circle cx="450" cy="30"  r="3.5" fill="#B8924A" fill-opacity="0.45"/>',
            '<circle cx="30"  cy="330" r="3.5" fill="#B8924A" fill-opacity="0.45"/>',
            '<circle cx="450" cy="330" r="3.5" fill="#B8924A" fill-opacity="0.45"/>',
          '</svg>',
          '<span class="product-card__tag">', p.tag, '</span>',
          '<button class="product-card__wish" data-id="' + p.id + '" aria-label="Add to wishlist">&#9825;</button>',
          '<div class="product-card__hover">',
            '<a href="' + waUrl(waMsg) + '" target="_blank" rel="noopener noreferrer" class="product-card__wa-btn">',
              'Enquire on WhatsApp',
            '</a>',
          '</div>',
        '</div>',
        '<div class="product-card__info">',
          '<div>',
            '<p class="product-card__fabric">', p.fabric, '</p>',
            '<h3 class="product-card__name">', p.name, '</h3>',
          '</div>',
          '<p class="product-card__price"><sup>&#8377;</sup>', p.price, '</p>',
        '</div>',
      '</article>'
    ].join('');
  }).join('');

  /* Wishlist toggle */
  var wishlist = [];
  el.addEventListener('click', function(e) {
    var btn = e.target.closest('.product-card__wish');
    if (!btn) return;
    var id = btn.getAttribute('data-id');
    if (wishlist.includes(id)) {
      wishlist = wishlist.filter(function(x) { return x !== id; });
      btn.innerHTML = '&#9825;';
      btn.classList.remove('active');
      btn.setAttribute('aria-label', 'Add to wishlist');
    } else {
      wishlist.push(id);
      btn.innerHTML = '&#9829;';
      btn.classList.add('active');
      btn.setAttribute('aria-label', 'Remove from wishlist');
    }
  });
}

/* ── Render: Craft Steps ── */
function renderCraftSteps() {
  var el = document.getElementById('craftSteps');
  if (!el) return;
  el.innerHTML = window.CRAFT_STEPS.map(function(s) {
    return [
      '<div class="craft-step">',
        '<span class="craft-step__roman">', s.roman, '</span>',
        '<div>',
          '<h4 class="craft-step__title">', s.title, '</h4>',
          '<p class="craft-step__desc">', s.desc, '</p>',
        '</div>',
      '</div>'
    ].join('');
  }).join('');
}

/* ── Render: Testimonials ── */
function renderTestimonials() {
  var sliderEl = document.getElementById('testimonialsSlider');
  var dotsEl   = document.getElementById('testimonialDots');
  if (!sliderEl || !dotsEl) return;

  var current = 0;
  var timer   = null;

  sliderEl.innerHTML = window.TESTIMONIALS.map(function(t, i) {
    return [
      '<div class="testimonial-slide' + (i === 0 ? ' active' : '') + '" role="tabpanel" aria-label="Testimonial ' + (i+1) + '">',
        '<blockquote class="testimonial__quote">&ldquo;', t.quote, '&rdquo;</blockquote>',
        '<div class="testimonial__author">',
          '<div class="testimonial__avatar" aria-hidden="true">', t.initial, '</div>',
          '<div>',
            '<p class="testimonial__name">', t.name, '</p>',
            '<p class="testimonial__city">', t.city, '</p>',
          '</div>',
        '</div>',
      '</div>'
    ].join('');
  }).join('');

  dotsEl.innerHTML = window.TESTIMONIALS.map(function(_, i) {
    return '<button class="testimonials__dot' + (i === 0 ? ' active' : '') + '" role="tab" aria-label="Go to testimonial ' + (i+1) + '" data-idx="' + i + '"></button>';
  }).join('');

  var slides = sliderEl.querySelectorAll('.testimonial-slide');
  var dots   = dotsEl.querySelectorAll('.testimonials__dot');

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = idx;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function autoPlay() {
    timer = setInterval(function() {
      goTo((current + 1) % window.TESTIMONIALS.length);
    }, 5000);
  }

  dotsEl.addEventListener('click', function(e) {
    var btn = e.target.closest('.testimonials__dot');
    if (!btn) return;
    clearInterval(timer);
    goTo(parseInt(btn.getAttribute('data-idx'), 10));
    autoPlay();
  });

  autoPlay();
}

/* ── Render: Accordion ── */
function renderAccordion() {
  var el = document.getElementById('accordion');
  if (!el) return;
  el.innerHTML = window.FAQS.map(function(f, i) {
    return [
      '<div class="accordion-item" role="listitem">',
        '<button class="accordion-item__trigger" aria-expanded="false" aria-controls="acc-body-' + i + '" id="acc-btn-' + i + '">',
          '<span class="accordion-item__q">', f.q, '</span>',
          '<span class="accordion-item__icon" aria-hidden="true">+</span>',
        '</button>',
        '<div class="accordion-item__body" id="acc-body-' + i + '" role="region" aria-labelledby="acc-btn-' + i + '" hidden>',
          '<p class="accordion-item__a">', f.a, '</p>',
        '</div>',
      '</div>'
    ].join('');
  }).join('');

  el.addEventListener('click', function(e) {
    var btn = e.target.closest('.accordion-item__trigger');
    if (!btn) return;
    var item = btn.closest('.accordion-item');
    var body = item.querySelector('.accordion-item__body');
    var isOpen = item.classList.contains('open');

    /* Close all */
    el.querySelectorAll('.accordion-item.open').forEach(function(openItem) {
      openItem.classList.remove('open');
      openItem.querySelector('.accordion-item__trigger').setAttribute('aria-expanded', 'false');
      openItem.querySelector('.accordion-item__body').removeAttribute('hidden');
    });

    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      body.removeAttribute('hidden');
    }
  });
}

/* ── Init all renderers ── */
window.addEventListener('DOMContentLoaded', function() {
  renderCollections();
  renderProducts();
  renderCraftSteps();
  renderTestimonials();
  renderAccordion();
});

const cartCount = document.querySelector('.cart-count');
const cartButton = document.querySelector('.cart-button');
const toast = document.querySelector('.toast');
const navToggle = document.querySelector('.nav-toggle');
const storeNav = document.querySelector('.store-nav');
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('#site-search');
const searchStatus = document.querySelector('.search-status');
let cartItems = 0;
let toastTimer;

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem('megamartCart')) || [];
cartItems = cart.reduce((total, item) => total + item.qty, 0);
cartCount.textContent = String(cartItems);
cartButton.setAttribute('aria-label', `Cart, ${cartItems} ${cartItems === 1 ? 'item' : 'items'}`);

function saveCart() {
  localStorage.setItem('megamartCart', JSON.stringify(cart));
  cartItems = cart.reduce((total, item) => total + item.qty, 0);
  cartCount.textContent = String(cartItems);
  cartButton.setAttribute('aria-label', `Cart, ${cartItems} ${cartItems === 1 ? 'item' : 'items'}`);
}

function announce(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

document.querySelectorAll('.add-button').forEach((button) => {
  button.addEventListener('click', () => {
    const productCard = button.closest('[data-product-card]') || button.closest('article');
    const productName = button.dataset.product;
    const priceEl = productCard ? productCard.querySelector('.price') : null;
    const priceText = priceEl ? priceEl.textContent.replace(/[^0-9.]/g, '') : '0';
    const price = parseFloat(priceText) || 0;

    const existing = cart.find((item) => item.name === productName);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name: productName, price, qty: 1 });
    }

    saveCart();
    announce(`${productName} added to cart`);
  });
});

navToggle.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
  storeNav.classList.toggle('is-open', !isOpen);
});

storeNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    storeNav.classList.remove('is-open');
  });
});

// Cart button — navigate to checkout page
cartButton.addEventListener('click', () => {
  window.location.href = 'checkout.html';
});

function filterProducts() {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  document.querySelectorAll('[data-product-card]').forEach((card) => {
    const matches = card.dataset.name.toLowerCase().includes(query);
    card.hidden = !matches;
    if (matches) visibleCount += 1;
  });

  searchStatus.textContent = query
    ? `${visibleCount} ${visibleCount === 1 ? 'product' : 'products'} match ${query}.`
    : '';
}

searchInput.addEventListener('input', filterProducts);
searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  document.querySelector('#smartphones').scrollIntoView({ behavior: 'smooth' });
  filterProducts();
});

// ---------------------------------------------------------------------------
// Hero carousel — auto sliding
// ---------------------------------------------------------------------------
const hero = document.querySelector('.hero');
const heroCopy = document.querySelector('.hero-copy');
const heroImageSlot = document.querySelector('.hero-image-slot');
const heroDots = document.querySelector('.hero-dots');
const dots = heroDots ? heroDots.querySelectorAll('i') : [];
const arrowLeft = document.querySelector('.carousel-arrow.arrow-left');
const arrowRight = document.querySelector('.carousel-arrow.arrow-right');

const slides = [
  {
    kicker: 'Best deal online on smart watches',
    title: 'SMART<br>WEARABLE.',
    discount: 'UP TO <strong>80%</strong> OFF',
    cta: 'Shop now',
    imageCaption: 'Smartwatch image',
    imageAria: 'Smartwatch product image placeholder',
    imageHtml: '<img src="images/smartwatch.png" alt="Smartwatch" style="width: 215px; height: 220px; object-fit: cover; display: block; margin: 0 auto;">',
  },
  {
    kicker: 'New season smartphones',
    title: 'SMART<br>PHONES.',
    discount: 'UP TO <strong>70%</strong> OFF',
    cta: 'Shop now',
    imageCaption: 'Smartphone image',
    imageAria: 'Smartphone product image placeholder',
    imageHtml: '<img src="images/smartphone.png" alt="Smartphone" style="width: 150px; height: 160px; object-fit: cover; display: block; margin: 0 auto;">',
  },
  {
    kicker: 'Electronics deals',
    title: 'SMART<br>LIVING.',
    discount: 'UP TO <strong>60%</strong> OFF',
    cta: 'Shop now',
    imageCaption: 'living image',
    imageAria: 'living product image placeholder',
    imageHtml: '<img src="images/living.png" alt="Living" style="width: 210px; height: 220px; object-fit: cover; display: block; margin: 0 auto;">',
  },
];

let currentSlide = 0;
let slideTimer;
const SLIDE_INTERVAL = 2000;
let isPaused = false;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function updateSlide(index) {
  if (!heroCopy || !heroImageSlot || dots.length === 0) return;

  const slide = slides[index];
  const kickerEl = heroCopy.querySelector('.hero-kicker');
  const titleEl = heroCopy.querySelector('#hero-title');
  const discountEl = heroCopy.querySelector('.hero-discount');
  const ctaEl = heroCopy.querySelector('.hero-cta');
  const captionEl = heroImageSlot.querySelector('.slot-caption');

  if (kickerEl) kickerEl.textContent = slide.kicker;
  if (titleEl) titleEl.innerHTML = slide.title;
  if (discountEl) discountEl.innerHTML = slide.discount;
  if (ctaEl) ctaEl.innerHTML = slide.cta + ' <span aria-hidden="true">→</span>';
  if (captionEl) captionEl.textContent = slide.imageCaption;

  // Swap the hero image for this slide
  if (heroImageSlot && slide.imageHtml) {
    const imageContainer = heroImageSlot.querySelector('span:first-child');
    if (imageContainer) {
      imageContainer.innerHTML = slide.imageHtml;
    } else {
      heroImageSlot.insertAdjacentHTML('afterbegin', `<span>${slide.imageHtml}</span>`);
    }
  }

  if (heroImageSlot) heroImageSlot.setAttribute('aria-label', slide.imageAria);

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });

  if (heroDots) {
    heroDots.setAttribute('aria-label', `Slide ${index + 1} of ${slides.length}`);
  }

  currentSlide = index;
}

function nextSlide() {
  const next = (currentSlide + 1) % slides.length;
  updateSlide(next);
}

function prevSlide() {
  const prev = (currentSlide - 1 + slides.length) % slides.length;
  updateSlide(prev);
}

function startAutoSlide() {
  if (isPaused || reducedMotion.matches || !hero) return;
  window.clearTimeout(slideTimer);
  slideTimer = window.setTimeout(() => {
    nextSlide();
    startAutoSlide();
  }, SLIDE_INTERVAL);
}

function stopAutoSlide() {
  window.clearTimeout(slideTimer);
}

if (hero) {
  hero.addEventListener('mouseenter', () => {
    isPaused = true;
    stopAutoSlide();
  });
  hero.addEventListener('mouseleave', () => {
    isPaused = false;
    startAutoSlide();
  });
}

if (arrowLeft) {
  arrowLeft.addEventListener('click', () => {
    stopAutoSlide();
    prevSlide();
    startAutoSlide();
  });
}

if (arrowRight) {
  arrowRight.addEventListener('click', () => {
    stopAutoSlide();
    nextSlide();
    startAutoSlide();
  });
}

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    stopAutoSlide();
    updateSlide(i);
    startAutoSlide();
  });
});

reducedMotion.addEventListener('change', (event) => {
  if (event.matches) {
    stopAutoSlide();
  } else {
    startAutoSlide();
  }
});

// Initialize
if (slides.length > 0) {
  updateSlide(0);
  if (!reducedMotion.matches) {
    startAutoSlide();
  }
}
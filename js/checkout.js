const cartContainer = document.querySelector('#cart-container');
const subtotalEl = document.querySelector('#cart-subtotal');
const deliveryEl = document.querySelector('#cart-delivery');
const totalEl = document.querySelector('#cart-total');
const checkoutBtn = document.querySelector('#checkout-btn');
const toast = document.querySelector('.toast');
const cartCount = document.querySelector('.cart-count');

let cart = JSON.parse(localStorage.getItem('megamartCart')) || [];

function announce(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(announce.timer);
  announce.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

function saveCart() {
  localStorage.setItem('megamartCart', JSON.stringify(cart));
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  if (cartCount) cartCount.textContent = String(totalQty);
}

function formatPrice(n) {
  return '₦' + n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function renderCart() {
  cartContainer.innerHTML = '';

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="cart-empty">
        <p>Your cart is empty.</p>
        <a href="index.html" class="btn-shop">Start Shopping</a>
      </div>
    `;
    subtotalEl.textContent = formatPrice(0);
    deliveryEl.textContent = formatPrice(0);
    totalEl.textContent = formatPrice(0);
    if (checkoutBtn) checkoutBtn.disabled = true;
    saveCart();
    return;
  }

  let subtotal = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;

    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <div class="cart-item-info">
        <h3 class="cart-item-name">${item.name}</h3>
        <p class="cart-item-price">${formatPrice(item.price)} each</p>
      </div>
      <div class="cart-item-controls">
        <div class="qty-controls">
          <button class="qty-btn qty-decrease" data-index="${index}">−</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn qty-increase" data-index="${index}">+</button>
        </div>
        <button class="remove-btn" data-index="${index}" aria-label="Remove ${item.name} from cart">Remove</button>
      </div>
      <div class="cart-item-total">${formatPrice(itemTotal)}</div>
    `;
    cartContainer.appendChild(itemEl);
  });

  const delivery = 0;
  const total = subtotal + delivery;

  subtotalEl.textContent = formatPrice(subtotal);
  deliveryEl.textContent = formatPrice(delivery);
  totalEl.textContent = formatPrice(total);

  if (checkoutBtn) checkoutBtn.disabled = false;
  saveCart();

  // Remove item listeners
  document.querySelectorAll('.remove-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index, 10);
      const removedName = cart[index].name;
      cart.splice(index, 1);
      saveCart();
      renderCart();
      announce(`${removedName} removed from cart`);
    });
  });

  // Decrease quantity listeners
  document.querySelectorAll('.qty-decrease').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index, 10);
      if (cart[index].qty > 1) {
        cart[index].qty -= 1;
      } else {
        cart.splice(index, 1);
      }
      saveCart();
      renderCart();
    });
  });

  // Increase quantity listeners
  document.querySelectorAll('.qty-increase').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index, 10);
      cart[index].qty += 1;
      saveCart();
      renderCart();
    });
  });
}

// Checkout button
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    announce('Checkout coming soon!');
  });
}

// Initialize
renderCart();
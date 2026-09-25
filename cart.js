/**
 * ShopEase - Cart Management & LocalStorage Handler
 */

const CART_STORAGE_KEY = 'shopease_cart';
const COUPON_STORAGE_KEY = 'shopease_coupon';

// Retrieve Cart from LocalStorage
function getCart() {
  try {
    const data = localStorage.getItem(CART_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error reading cart from LocalStorage:', err);
    return [];
  }
}

// Save Cart to LocalStorage and update badge
function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartCountBadge();
  } catch (err) {
    console.error('Error saving cart to LocalStorage:', err);
  }
}

// Update navbar cart badge counter across all pages
function updateCartCountBadge() {
  const cart = getCart();
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badges = document.querySelectorAll('.cart-badge');
  badges.forEach(badge => {
    badge.textContent = totalCount;
  });
}

// Add item to cart
function addToCart(product, quantity = 1) {
  let cart = getCart();
  const existingIndex = cart.findIndex(item => item.id === product.id);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: quantity
    });
  }

  saveCart(cart);
  showToast(`Added "${product.name}" to your cart! 🛒`);
}

// Update Item Quantity
function updateCartQuantity(productId, newQuantity) {
  let cart = getCart();
  if (newQuantity <= 0) {
    removeFromCart(productId);
    return;
  }
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity = newQuantity;
    saveCart(cart);
    renderCartPage();
  }
}

// Remove Item from Cart
function removeFromCart(productId) {
  let cart = getCart();
  const item = cart.find(i => i.id === productId);
  cart = cart.filter(i => i.id !== productId);
  saveCart(cart);
  if (item) {
    showToast(`Removed "${item.name}" from cart`);
  }
  renderCartPage();
}

// Clear Entire Cart
function clearCart() {
  if (getCart().length === 0) return;
  if (confirm('Are you sure you want to clear your shopping cart?')) {
    saveCart([]);
    showToast('Cart cleared!');
    renderCartPage();
  }
}

// Calculate Cart Summary Totals
function getCartTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Delivery Charge: Free over ₹2,000, otherwise ₹50
  const deliveryCharge = subtotal === 0 ? 0 : (subtotal > 2000 ? 0 : 50);

  // Applied Coupon discount check
  const appliedCoupon = localStorage.getItem(COUPON_STORAGE_KEY) || '';
  let discount = 0;
  if (appliedCoupon === 'SHOPEASE10') {
    discount = Math.round(subtotal * 0.10); // 10% discount
  } else if (appliedCoupon === 'WELCOME500' && subtotal >= 1000) {
    discount = 500;
  } else if (appliedCoupon === 'SHOPEASE2026') {
    discount = Math.round(subtotal * 0.15); // 15% promotional discount
  }

  // Tax: 5% GST
  const tax = Math.round((subtotal - discount) * 0.05);

  const grandTotal = Math.max(0, subtotal - discount + deliveryCharge + tax);

  return {
    subtotal,
    discount,
    deliveryCharge,
    tax,
    grandTotal,
    appliedCoupon
  };
}

// Render Cart Page (cart.html)
function renderCartPage() {
  const cartItemsContainer = document.getElementById('cart-items-list');
  const cartSummaryContainer = document.getElementById('cart-summary-card');

  if (!cartItemsContainer || !cartSummaryContainer) return;

  const cart = getCart();
  const totals = getCartTotals();

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🛒</div>
        <h3>Your shopping cart is empty</h3>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <a href="products.html" class="btn btn-primary">Browse Products</a>
      </div>
    `;
    cartSummaryContainer.style.display = 'none';
    return;
  }

  cartSummaryContainer.style.display = 'block';

  // Render Items List
  cartItemsContainer.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-color);">
      <h3 style="font-size: 1.25rem;">Shopping Cart (${cart.reduce((a, b) => a + b.quantity, 0)} Items)</h3>
      <button class="btn btn-outline btn-sm btn-danger" onclick="clearCart()">Clear Cart</button>
    </div>
    ${cart.map(item => `
      <div class="cart-item" id="cart-item-${item.id}">
        <img class="cart-item-img" src="${item.image}" alt="${item.name}" referrerPolicy="no-referrer" />
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <span class="cart-item-price">₹${item.price.toLocaleString('en-IN')} each</span>
        </div>
        <div>
          <div class="quantity-controls">
            <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
            <span class="quantity-val">${item.quantity}</span>
            <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
          </div>
        </div>
        <div>
          <div class="cart-item-subtotal">₹${(item.price * item.quantity).toLocaleString('en-IN')}</div>
          <button style="background: none; border: none; color: #ef4444; font-size: 0.85rem; cursor: pointer; margin-top: 0.3rem;" onclick="removeFromCart(${item.id})">
            Remove
          </button>
        </div>
      </div>
    `).join('')}
    <div class="cart-actions">
      <a href="products.html" class="btn btn-outline">← Continue Shopping</a>
      <a href="checkout.html" class="btn btn-accent">Proceed to Checkout →</a>
    </div>
  `;

  // Render Summary
  cartSummaryContainer.innerHTML = `
    <h3 class="summary-title">Order Summary</h3>
    <div class="summary-row">
      <span>Subtotal</span>
      <span>₹${totals.subtotal.toLocaleString('en-IN')}</span>
    </div>
    ${totals.discount > 0 ? `
      <div class="summary-row" style="color: #16a34a;">
        <span>Promo Discount (${totals.appliedCoupon})</span>
        <span>-₹${totals.discount.toLocaleString('en-IN')}</span>
      </div>
    ` : ''}
    <div class="summary-row">
      <span>Delivery Charge</span>
      <span>${totals.deliveryCharge === 0 ? '<strong style="color: #16a34a;">FREE</strong>' : '₹' + totals.deliveryCharge}</span>
    </div>
    <div class="summary-row">
      <span>Estimated Tax (5% GST)</span>
      <span>₹${totals.tax.toLocaleString('en-IN')}</span>
    </div>
    
    <!-- Coupon Promo Input -->
    <div style="margin: 1.25rem 0; padding-top: 1rem; border-top: 1px solid var(--border-color);">
      <label style="font-size: 0.85rem; font-weight: 600; display: block; margin-bottom: 0.4rem;">Have a Promo Code?</label>
      <div style="display: flex; gap: 0.5rem;">
        <input type="text" id="coupon-code-input" placeholder="e.g. SHOPEASE2026" value="${totals.appliedCoupon}" style="flex: 1; padding: 0.45rem 0.75rem; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 0.85rem;" />
        <button class="btn btn-primary btn-sm" onclick="applyCouponCode()">Apply</button>
      </div>
      <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.3rem;">Try code <strong>SHOPEASE2026</strong> for 15% OFF</p>
    </div>

    <div class="summary-row total">
      <span>Grand Total</span>
      <span>₹${totals.grandTotal.toLocaleString('en-IN')}</span>
    </div>
    <a href="checkout.html" class="btn btn-accent btn-block" style="margin-top: 1.25rem;">
      Proceed to Checkout
    </a>
  `;
}

// Apply Coupon Code
function applyCouponCode() {
  const input = document.getElementById('coupon-code-input');
  if (!input) return;
  const code = input.value.trim().toUpperCase();

  if (code === 'SHOPEASE2026' || code === 'SHOPEASE10' || code === 'WELCOME500') {
    localStorage.setItem(COUPON_STORAGE_KEY, code);
    showToast(`Promo code "${code}" applied successfully! 🎉`);
    renderCartPage();
  } else if (code === '') {
    localStorage.removeItem(COUPON_STORAGE_KEY);
    showToast('Promo code removed.');
    renderCartPage();
  } else {
    showToast('Invalid promo code. Try SHOPEASE2026');
  }
}

// Toast notification helper
function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  updateCartCountBadge();
  renderCartPage();
});

// Expose functions globally
window.addToCart = addToCart;
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.getCart = getCart;
window.getCartTotals = getCartTotals;
window.applyCouponCode = applyCouponCode;
window.showToast = showToast;

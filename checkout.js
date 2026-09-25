/**
 * ShopEase - Checkout & Order Processing Handler
 */

document.addEventListener('DOMContentLoaded', () => {
  const checkoutSummaryContainer = document.getElementById('checkout-order-summary');
  const checkoutForm = document.getElementById('checkout-form');

  if (checkoutSummaryContainer) {
    renderCheckoutSummary();
  }

  if (checkoutForm) {
    prefillUserData();
    setupCheckoutForm();
  }
});

// Render Checkout Order Summary
function renderCheckoutSummary() {
  const container = document.getElementById('checkout-order-summary');
  if (!container) return;

  const cart = typeof getCart === 'function' ? getCart() : [];
  const totals = typeof getCartTotals === 'function' ? getCartTotals() : { subtotal: 0, discount: 0, deliveryCharge: 0, tax: 0, grandTotal: 0 };

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>Your cart is empty!</p>
        <a href="products.html" class="btn btn-primary btn-sm" style="margin-top: 1rem;">Add Products</a>
      </div>
    `;
    const placeBtn = document.getElementById('btn-place-order');
    if (placeBtn) placeBtn.disabled = true;
    return;
  }

  container.innerHTML = `
    <h3 class="summary-title">Order Items (${cart.length})</h3>
    <div style="max-height: 240px; overflow-y: auto; margin-bottom: 1.25rem; padding-right: 0.5rem;">
      ${cart.map(item => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 0; border-bottom: 1px solid var(--border-color);">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <img src="${item.image}" alt="${item.name}" style="width: 45px; height: 45px; object-fit: cover; border-radius: 6px;" referrerPolicy="no-referrer" />
            <div>
              <div style="font-weight: 600; font-size: 0.9rem;">${item.name}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Qty: ${item.quantity}</div>
            </div>
          </div>
          <div style="font-weight: 700; font-size: 0.9rem;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</div>
        </div>
      `).join('')}
    </div>

    <div class="summary-row">
      <span>Subtotal</span>
      <span>₹${totals.subtotal.toLocaleString('en-IN')}</span>
    </div>
    ${totals.discount > 0 ? `
      <div class="summary-row" style="color: #16a34a;">
        <span>Promo Discount</span>
        <span>-₹${totals.discount.toLocaleString('en-IN')}</span>
      </div>
    ` : ''}
    <div class="summary-row">
      <span>Delivery</span>
      <span>${totals.deliveryCharge === 0 ? '<strong style="color: #16a34a;">FREE</strong>' : '₹' + totals.deliveryCharge}</span>
    </div>
    <div class="summary-row">
      <span>Tax (5% GST)</span>
      <span>₹${totals.tax.toLocaleString('en-IN')}</span>
    </div>
    <div class="summary-row total">
      <span>Total Amount</span>
      <span>₹${totals.grandTotal.toLocaleString('en-IN')}</span>
    </div>
  `;
}

// Pre-fill form if user logged in
function prefillUserData() {
  try {
    const userStr = localStorage.getItem('shopease_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (document.getElementById('full-name') && user.fullName) document.getElementById('full-name').value = user.fullName;
      if (document.getElementById('email') && user.email) document.getElementById('email').value = user.email;
      if (document.getElementById('phone') && user.phone) document.getElementById('phone').value = user.phone;
    }
  } catch (err) {
    console.error('Error prefilling user data:', err);
  }
}

// Payment method options toggle
window.togglePaymentFields = function(method) {
  const upiBox = document.getElementById('upi-details');
  const cardBox = document.getElementById('card-details');

  if (upiBox) upiBox.style.display = method === 'upi' ? 'block' : 'none';
  if (cardBox) cardBox.style.display = method === 'card' ? 'block' : 'none';
};

// Setup Checkout Form Submission
function setupCheckoutForm() {
  const checkoutForm = document.getElementById('checkout-form');
  if (!checkoutForm) return;

  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const cart = typeof getCart === 'function' ? getCart() : [];
    if (cart.length === 0) {
      alert('Your cart is empty. Please add items before placing an order.');
      return;
    }

    // Input fields
    const fullName = document.getElementById('full-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value.trim();
    const pincode = document.getElementById('pincode').value.trim();
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;

    // Validation
    if (!fullName || !email || !phone || !address || !city || !state || !pincode) {
      alert('Please fill in all required customer and address fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
      alert('Please enter a valid 10-digit mobile phone number.');
      return;
    }

    const pincodeRegex = /^[0-9]{6}$/;
    if (!pincodeRegex.test(pincode.trim())) {
      alert('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    if (!paymentMethod) {
      alert('Please select a payment method.');
      return;
    }

    // Payment method sub-validation
    if (paymentMethod === 'upi') {
      const upiId = document.getElementById('upi-id')?.value.trim();
      if (!upiId) {
        alert('Please enter your UPI ID.');
        return;
      }
    } else if (paymentMethod === 'card') {
      const cardNumber = document.getElementById('card-number')?.value.trim();
      const cardExpiry = document.getElementById('card-expiry')?.value.trim();
      const cardCvv = document.getElementById('card-cvv')?.value.trim();
      if (!cardNumber || !cardExpiry || !cardCvv) {
        alert('Please fill in all credit/debit card details.');
        return;
      }
    }

    // Generate Order ID
    const today = new Date();
    const dateStr = today.getFullYear() +
      String(today.getMonth() + 1).padStart(2, '0') +
      String(today.getDate()).padStart(2, '0');
    const randomNum = Math.floor(100 + Math.random() * 900);
    const orderId = `SE${dateStr}${randomNum}`;

    const totals = typeof getCartTotals === 'function' ? getCartTotals() : {};

    // Create Order Record
    const newOrder = {
      orderId,
      date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      customer: { fullName, email, phone, address, city, state, pincode },
      paymentMethod: paymentMethod.toUpperCase(),
      items: cart,
      totals
    };

    // Save to Order History in LocalStorage
    try {
      const existingOrders = JSON.parse(localStorage.getItem('shopease_orders') || '[]');
      existingOrders.unshift(newOrder);
      localStorage.setItem('shopease_orders', JSON.stringify(existingOrders));
    } catch (err) {
      console.error('Error saving order history:', err);
    }

    // Clear Cart
    try {
      localStorage.setItem('shopease_cart', JSON.stringify([]));
      if (typeof updateCartCountBadge === 'function') updateCartCountBadge();
    } catch (err) {
      console.error('Error clearing cart:', err);
    }

    // Show Confirmation Modal
    showOrderSuccessModal(newOrder);
  });
}

// Show Order Success Modal
function showOrderSuccessModal(order) {
  const modalOverlay = document.getElementById('order-modal');
  const modalBody = document.getElementById('order-modal-body');

  if (!modalOverlay || !modalBody) {
    alert(`Order placed successfully! 🎉\nOrder ID: ${order.orderId}`);
    window.location.href = 'index.html';
    return;
  }

  modalBody.innerHTML = `
    <div class="order-success-content">
      <div class="success-icon">🎉</div>
      <h2 style="color: #16a34a; margin-bottom: 0.5rem;">Order Placed Successfully!</h2>
      <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Thank you for shopping with ShopEase. Your order has been confirmed.</p>
      
      <div style="background: #f8fafc; border: 1px dashed var(--border-color); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem; text-align: left;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <strong style="color: var(--text-dark);">Order ID:</strong>
          <span style="font-family: monospace; font-weight: 700; color: var(--primary-color);">${order.orderId}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <strong style="color: var(--text-dark);">Customer Name:</strong>
          <span>${order.customer.fullName}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <strong style="color: var(--text-dark);">Delivery Address:</strong>
          <span style="max-width: 250px; text-align: right;">${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <strong style="color: var(--text-dark);">Payment Method:</strong>
          <span>${order.paymentMethod}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 1.1rem; font-weight: 800; border-top: 1px solid var(--border-color); padding-top: 0.5rem; margin-top: 0.5rem;">
          <span>Total Paid:</span>
          <span>₹${order.totals.grandTotal.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div style="display: flex; gap: 1rem; justify-content: center;">
        <a href="index.html" class="btn btn-primary" style="flex: 1;">Return to Home</a>
        <a href="products.html" class="btn btn-outline" style="flex: 1;">Continue Shopping</a>
      </div>
    </div>
  `;

  modalOverlay.classList.add('active');
}

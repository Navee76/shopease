/**
 * ShopEase - Products Data & Products Page Handler
 */

// Product Dataset (At least 12 products as requested)
const PRODUCTS = [
  {
    id: 1,
    name: "Smartphone Pro Max",
    category: "Electronics",
    price: 15999,
    rating: 4.5,
    ratingCount: 128,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
    description: "Latest 5G smartphone featuring 6.7-inch AMOLED 120Hz display, 64MP AI camera system, and 5000mAh fast-charging battery.",
    stock: 12
  },
  {
    id: 2,
    name: "Ultra Slim Laptop",
    category: "Electronics",
    price: 49999,
    rating: 4.8,
    ratingCount: 94,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80",
    description: "High-performance metallic notebook powered by Intel Core i7 processor, 16GB RAM, 512GB SSD and backlit keyboard.",
    stock: 8
  },
  {
    id: 3,
    name: "HD Retina Tablet",
    category: "Electronics",
    price: 19999,
    rating: 4.3,
    ratingCount: 62,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
    description: "10.5-inch crisp tablet with stylus compatibility, stereo quad speakers, and long 14-hour battery endurance.",
    stock: 15
  },
  {
    id: 4,
    name: "Wireless Earbuds ANC",
    category: "Electronics",
    price: 2999,
    rating: 4.6,
    ratingCount: 210,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
    description: "Active noise cancelling true wireless earbuds with deep punchy bass, touch controls, and 30-hour playback case.",
    stock: 25
  },
  {
    id: 5,
    name: "Cotton Graphic T-Shirt",
    category: "Fashion",
    price: 799,
    rating: 4.2,
    ratingCount: 180,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
    description: "Soft 100% combed cotton classic crew-neck t-shirt with modern minimalist graphic print for everyday street style.",
    stock: 40
  },
  {
    id: 6,
    name: "Slim Fit Stretch Jeans",
    category: "Fashion",
    price: 1499,
    rating: 4.4,
    ratingCount: 115,
    image: "https://images.unsplash.com/photo-1542272604-780c36856842?w=600&auto=format&fit=crop&q=80",
    description: "Premium washed stretch denim jeans with slim fit silhouette, standard 5-pocket construction, and durable zip fly.",
    stock: 20
  },
  {
    id: 7,
    name: "Fleece Pullover Hoodie",
    category: "Fashion",
    price: 1299,
    rating: 4.7,
    ratingCount: 88,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80",
    description: "Cozy brushed fleece hoodie featuring adjustable drawstring hood, kangaroo front pouch, and ribbed cuffs.",
    stock: 18
  },
  {
    id: 8,
    name: "Urban Bomber Jacket",
    category: "Fashion",
    price: 2499,
    rating: 4.6,
    ratingCount: 76,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
    description: "Lightweight weather-resistant bomber jacket with zip utility sleeve pocket and comfortable tailored fit.",
    stock: 10
  },
  {
    id: 9,
    name: "Air-Cushioned Sports Shoes",
    category: "Footwear",
    price: 1999,
    rating: 4.8,
    ratingCount: 240,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    description: "Ergonomic running shoes featuring breathable mesh upper, shock-absorbing air sole cushion, and high-traction rubber outsole.",
    stock: 30
  },
  {
    id: 10,
    name: "Casual Canvas Sneakers",
    category: "Footwear",
    price: 1599,
    rating: 4.3,
    ratingCount: 95,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80",
    description: "Timeless low-top canvas sneakers with vulcanized rubber sole and soft cushioned footbed for all-day wear.",
    stock: 22
  },
  {
    id: 11,
    name: "Fitness Smart Watch",
    category: "Accessories",
    price: 2499,
    rating: 4.5,
    ratingCount: 160,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    description: "Full-touch smartwatch with continuous heart rate monitoring, SpO2 tracker, 50+ sports modes, and 10-day battery life.",
    stock: 16
  },
  {
    id: 12,
    name: "Waterproof Laptop Backpack",
    category: "Accessories",
    price: 999,
    rating: 4.4,
    ratingCount: 142,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    description: "Durable Oxford fabric travel backpack with padded 15.6-inch laptop compartment, integrated USB charging port and anti-theft pocket.",
    stock: 35
  }
];

// Helper: Format price in Indian Rupees (₹)
function formatPrice(price) {
  return '₹' + Number(price).toLocaleString('en-IN');
}

// Helper: Render star ratings
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  let starsHtml = '';
  for (let i = 0; i < fullStars; i++) {
    starsHtml += '★';
  }
  if (hasHalf) {
    starsHtml += '½';
  }
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '☆';
  }
  return `<span class="stars">${starsHtml}</span> <span class="rating-val">${rating}</span>`;
}

// Products Page State
let currentCategory = 'All';
let currentSearch = '';
let currentSort = 'default';

// Initialize Products Page if element exists
document.addEventListener('DOMContentLoaded', () => {
  const productsContainer = document.getElementById('products-grid');
  
  if (productsContainer) {
    // Check URL parameters for search query or category filter
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    const searchParam = urlParams.get('search');

    if (categoryParam) {
      currentCategory = categoryParam;
      // Highlight category button if active
      const filterBtns = document.querySelectorAll('.filter-btn');
      filterBtns.forEach(btn => {
        if (btn.dataset.category.toLowerCase() === categoryParam.toLowerCase()) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    if (searchParam) {
      currentSearch = searchParam.trim();
      const searchInput = document.getElementById('page-search-input');
      if (searchInput) searchInput.value = currentSearch;
    }

    renderProductsPage();
    setupProductListeners();
  }

  // Handle Featured Products section on Homepage
  const featuredGrid = document.getElementById('featured-products-grid');
  if (featuredGrid) {
    renderFeaturedProducts(featuredGrid);
  }
});

// Render Featured Products on Home Page (First 4 top-rated items)
function renderFeaturedProducts(container) {
  const featuredList = [...PRODUCTS]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  container.innerHTML = featuredList.map(product => createProductCardHtml(product)).join('');
}

// Filter and Sort Products
function getFilteredProducts() {
  let list = [...PRODUCTS];

  // Category Filter
  if (currentCategory && currentCategory !== 'All') {
    list = list.filter(p => p.category.toLowerCase() === currentCategory.toLowerCase());
  }

  // Search Filter
  if (currentSearch) {
    const term = currentSearch.toLowerCase();
    list = list.filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.description.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
  }

  // Sorting
  if (currentSort === 'price-low-high') {
    list.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'price-high-low') {
    list.sort((a, b) => b.price - a.price);
  } else if (currentSort === 'rating-high-low') {
    list.sort((a, b) => b.rating - a.rating);
  }

  return list;
}

// Render Products Grid
function renderProductsPage() {
  const container = document.getElementById('products-grid');
  if (!container) return;

  const filtered = getFilteredProducts();

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon">🔍</div>
        <h3>No products found</h3>
        <p>Try searching for a different keyword or select another category filter.</p>
        <button class="btn btn-primary" id="btn-reset-filters">Reset Filters</button>
      </div>
    `;
    const resetBtn = document.getElementById('btn-reset-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentCategory = 'All';
        currentSearch = '';
        currentSort = 'default';
        
        // Reset UI buttons and inputs
        document.querySelectorAll('.filter-btn').forEach(btn => {
          btn.classList.toggle('active', btn.dataset.category === 'All');
        });
        const pageSearchInput = document.getElementById('page-search-input');
        if (pageSearchInput) pageSearchInput.value = '';
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) sortSelect.value = 'default';

        renderProductsPage();
      });
    }
    return;
  }

  container.innerHTML = filtered.map(product => createProductCardHtml(product)).join('');
}

// Generate Product Card HTML
function createProductCardHtml(product) {
  return `
    <div class="product-card" id="product-card-${product.id}">
      <div class="product-image-wrap" onclick="openProductModal(${product.id})">
        <img src="${product.image}" alt="${product.name}" loading="lazy" referrerPolicy="no-referrer" />
        <span class="product-badge-stock">In Stock</span>
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3 class="product-title" onclick="openProductModal(${product.id})">${product.name}</h3>
        <p class="product-desc">${product.description}</p>
        <div class="product-rating">
          ${renderStars(product.rating)}
          <span class="rating-count">(${product.ratingCount})</span>
        </div>
        <div class="product-bottom">
          <span class="product-price">${formatPrice(product.price)}</span>
          <div class="product-actions">
            <button class="btn-card-cart" id="btn-add-cart-${product.id}" onclick="handleAddToCart(${product.id})" title="Add to Cart">
              + Cart
            </button>
            <button class="btn btn-accent btn-sm" id="btn-buy-now-${product.id}" onclick="handleBuyNow(${product.id})">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Set up Filter, Search & Sort Event Listeners
function setupProductListeners() {
  // Category filter buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentCategory = e.target.dataset.category;
      renderProductsPage();
    });
  });

  // On-page Search Input
  const searchInput = document.getElementById('page-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim();
      renderProductsPage();
    });
  }

  // Sort Selector
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderProductsPage();
    });
  }
}

// Open Product Details Modal
function openProductModal(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const modalOverlay = document.getElementById('product-modal');
  const modalContainer = document.getElementById('product-modal-body');

  if (!modalOverlay || !modalContainer) return;

  modalContainer.innerHTML = `
    <div class="product-detail-layout">
      <div>
        <img class="product-detail-img" src="${product.image}" alt="${product.name}" referrerPolicy="no-referrer" />
      </div>
      <div>
        <span class="product-category">${product.category}</span>
        <h2 style="font-size: 1.75rem; margin-bottom: 0.5rem;">${product.name}</h2>
        <div class="product-rating" style="margin-bottom: 1rem;">
          ${renderStars(product.rating)}
          <span class="rating-count">(${product.ratingCount} reviews)</span>
        </div>
        <div style="font-size: 1.75rem; font-weight: 800; color: var(--primary-color); margin-bottom: 1rem;">
          ${formatPrice(product.price)}
        </div>
        <p style="color: var(--text-muted); margin-bottom: 1.25rem;">${product.description}</p>
        <div style="margin-bottom: 1.5rem; font-size: 0.9rem; font-weight: 600; color: #16a34a;">
          ✓ In Stock (${product.stock} items available)
        </div>
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
          <label style="font-weight: 600;">Quantity:</label>
          <div class="quantity-controls">
            <button class="quantity-btn" onclick="adjustModalQty(-1)">-</button>
            <span class="quantity-val" id="modal-qty-val">1</span>
            <button class="quantity-btn" onclick="adjustModalQty(1)">+</button>
          </div>
        </div>
        <div style="display: flex; gap: 1rem;">
          <button class="btn btn-primary" style="flex: 1;" onclick="addModalItemToCart(${product.id})">
            🛒 Add to Cart
          </button>
          <button class="btn btn-accent" style="flex: 1;" onclick="buyNowModalItem(${product.id})">
            ⚡ Buy Now
          </button>
        </div>
      </div>
    </div>
  `;

  modalOverlay.classList.add('active');
}

function closeProductModal() {
  const modalOverlay = document.getElementById('product-modal');
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
  }
}

function adjustModalQty(delta) {
  const qtySpan = document.getElementById('modal-qty-val');
  if (!qtySpan) return;
  let val = parseInt(qtySpan.textContent, 10) || 1;
  val = Math.max(1, val + delta);
  qtySpan.textContent = val;
}

function addModalItemToCart(productId) {
  const qtySpan = document.getElementById('modal-qty-val');
  const qty = qtySpan ? parseInt(qtySpan.textContent, 10) || 1 : 1;
  handleAddToCart(productId, qty);
  closeProductModal();
}

function buyNowModalItem(productId) {
  const qtySpan = document.getElementById('modal-qty-val');
  const qty = qtySpan ? parseInt(qtySpan.textContent, 10) || 1 : 1;
  handleBuyNow(productId, qty);
  closeProductModal();
}

// Handlers connected to window for inline onclick access
window.handleAddToCart = function(productId, qty = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  if (typeof addToCart === 'function') {
    addToCart(product, qty);
  } else {
    console.error('addToCart function not available');
  }
};

window.handleBuyNow = function(productId, qty = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  if (typeof addToCart === 'function') {
    addToCart(product, qty);
    window.location.href = 'checkout.html';
  }
};

window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.adjustModalQty = adjustModalQty;
window.addModalItemToCart = addModalItemToCart;
window.buyNowModalItem = buyNowModalItem;

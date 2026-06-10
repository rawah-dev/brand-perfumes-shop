// Product Data
const products = [
  { id: 1, name: "Eclat Noir", price: 285, category: "مسائي", notes: "شرقي", intensity: "قوي", image: "img/eclat_noir.png", rating: 4.8 },
  { id: 2, name: "Aurora Blanche", price: 320, category: "يومي", notes: "زهري", intensity: "متوسط", image: "img/aurora_blanche.png", rating: 4.9 },
  { id: 3, name: "Velvet Amber", price: 295, category: "خاص", notes: "خشبي", intensity: "قوي", image: "img/velvet_amber.png", rating: 4.7 },
  { id: 4, name: "Mystic Orchid", price: 340, category: "مسائي", notes: "زهري", intensity: "قوي", image: "img/mystic_orchid.png", rating: 5.0 },
  { id: 5, name: "Amber Royal", price: 310, category: "خاص", notes: "شرقي", intensity: "متوسط", image: "img/amber_royal.png", rating: 4.6 },
  { id: 6, name: "Citrus Reverie", price: 265, category: "يومي", notes: "حمضيات", intensity: "خفيف", image: "img/citrus_reverie.png", rating: 4.5 },
  { id: 7, name: "Oud Collection", price: 450, category: "خاص", notes: "شرقي", intensity: "قوي", image: "img/eclat_noir.png", rating: 4.9 },
  { id: 8, name: "Midnight Rose", price: 275, category: "مسائي", notes: "زهري", intensity: "متوسط", image: "img/mystic_orchid.png", rating: 4.7 },
  { id: 10, name: "Lavender Breeze", price: 195, category: "يومي", notes: "زهري", intensity: "خفيف", image: "img/aurora_blanche.png", rating: 4.4 },
  { id: 11, name: "Vanilla Dream", price: 220, category: "مسائي", notes: "شرقي", intensity: "متوسط", image: "img/velvet_amber.png", rating: 4.8 },
  { id: 12, name: "Patchouli Gold", price: 380, category: "خاص", notes: "خشبي", intensity: "قوي", image: "img/amber_royal.png", rating: 4.9 },
];

// State Management
let cart = JSON.parse(localStorage.getItem('luxure_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('luxure_wishlist')) || [];
let currentTheme = localStorage.getItem('luxure_theme') || 'light';

// Initialize
window.addEventListener("load", () => {
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon();

  const homeGrid = document.querySelector(".perfume-grid");
  const shopGrid = document.getElementById("fullProductGrid");

  if (homeGrid) renderProducts(products.slice(0, 6), homeGrid);
  if (shopGrid) renderProducts(products, shopGrid);

  updateCartUI();
  updateWishlistUI();
  initAnimations();
  
  const searchInput = document.getElementById('searchInput');
  if(searchInput) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.notes.toLowerCase().includes(searchTerm)
      );
      if (homeGrid) renderProducts(filtered, homeGrid);
      if (shopGrid) renderProducts(filtered, shopGrid);
    });
  }
});

// Theme Logic
function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  localStorage.setItem('luxure_theme', currentTheme);
  updateThemeIcon();
}

function updateThemeIcon() {
  const icon = document.querySelector('#themeToggle i');
  if (icon) {
    icon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
  }
}

// Filtering Logic
function filterProducts() {
  const shopGrid = document.getElementById("fullProductGrid");
  if (!shopGrid) return;

  const checkedCategories = Array.from(document.querySelectorAll('.filter-group input[type="checkbox"]:checked')).map(cb => cb.value);
  const maxPrice = document.getElementById('priceRange').value;
  const priceLabel = document.getElementById('priceLabel');
  if(priceLabel) priceLabel.textContent = `$${maxPrice}`;

  const filtered = products.filter(p => {
    const categoryMatch = checkedCategories.length === 0 || checkedCategories.includes(p.category) || checkedCategories.includes(p.notes);
    const priceMatch = p.price <= maxPrice;
    return categoryMatch && priceMatch;
  });

  renderProducts(filtered, shopGrid);
}

// Render Products
function renderProducts(productsToRender, gridElement) {
  if (!gridElement) return;

  gridElement.innerHTML = productsToRender.map(product => {
    const isWishlisted = wishlist.includes(product.id);
    const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
    return `
      <div class="perfume-card reveal active">
        <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist(${product.id}, this)">
          <i class="${isWishlisted ? 'fas' : 'far'} fa-heart"></i>
        </button>
        <div class="card-image">
          <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/250x250?text=${product.name}'" />
        </div>
        <div class="perfume-info">
          <div class="rating" style="color: var(--gold); font-size: 0.8rem; margin-bottom: 0.5rem;">
            ${stars} <span style="color: #999;">(${product.rating})</span>
          </div>
          <p class="category-tag">${product.notes} | ${product.category}</p>
          <h3>${product.name}</h3>
          <div class="price">$${product.price}</div>
          <button class="add-to-cart" onclick="addToCart(${product.id})">
            أضف إلى السلة
          </button>
        </div>
      </div>
    `;
  }).join("");
}

// Wishlist Logic
function toggleWishlist(productId, btn) {
  const index = wishlist.indexOf(productId);
  if (index === -1) {
    wishlist.push(productId);
    if(btn) {
      btn.classList.add('active');
      btn.querySelector('i').className = 'fas fa-heart';
    }
    showNotification("تمت الإضافة لقائمة الأمنيات");
  } else {
    wishlist.splice(index, 1);
    if(btn) {
      btn.classList.remove('active');
      btn.querySelector('i').className = 'far fa-heart';
    }
    showNotification("تمت الإزالة من قائمة الأمنيات");
  }
  localStorage.setItem('luxure_wishlist', JSON.stringify(wishlist));
  updateWishlistUI();
}

function updateWishlistUI() {
  const wishlistItems = document.getElementById("wishlistItems");
  if (!wishlistItems) return;

  if (wishlist.length === 0) {
    wishlistItems.innerHTML = '<p style="text-align:center; padding:2rem; color:#999;">قائمة الأمنيات فارغة</p>';
    return;
  }

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));
  wishlistItems.innerHTML = wishlistedProducts.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/60x80'" />
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <div class="price">$${item.price}</div>
        <button class="add-to-cart" onclick="addToCart(${item.id})" style="width:auto; padding:0.5rem 1rem; font-size:0.8rem; margin-top:0.5rem;">
          أضف للسلة
        </button>
      </div>
      <button onclick="toggleWishlist(${item.id}, null)" class="remove-item"><i class="fas fa-trash"></i></button>
    </div>
  `).join("");
}

// Sidebars & Overlay Logic
function toggleCart() {
  const cartSidebar = document.getElementById("cartSidebar");
  const overlay = document.getElementById("overlay");
  
  const isOpen = cartSidebar.classList.toggle("open");
  document.getElementById("wishlistSidebar").classList.remove("open");
  
  if (isOpen) {
    overlay.classList.add("active");
  } else {
    overlay.classList.remove("active");
  }
}

function toggleWishlistSidebar() {
  const wishlistSidebar = document.getElementById("wishlistSidebar");
  const overlay = document.getElementById("overlay");
  
  const isOpen = wishlistSidebar.classList.toggle("open");
  document.getElementById("cartSidebar").classList.remove("open");
  
  if (isOpen) {
    overlay.classList.add("active");
  } else {
    overlay.classList.remove("active");
  }
}

function closeAllSidebars() {
  document.getElementById("cartSidebar").classList.remove("open");
  document.getElementById("wishlistSidebar").classList.remove("open");
  document.getElementById("overlay").classList.remove("active");
  document.querySelector(".nav-links").classList.remove("active");
  document.getElementById("checkoutModal").classList.remove("active");
}

function toggleMenu() {
  const navLinks = document.querySelector(".nav-links");
  const overlay = document.getElementById("overlay");
  const isOpen = navLinks.classList.toggle("active");
  
  if (isOpen) {
    overlay.classList.add("active");
  } else {
    overlay.classList.remove("active");
  }
}

// Scroll animations
const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("active");
  });
}, observerOptions);

function initAnimations() {
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

// Cart Logic
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCartUI();
  showNotification(`تم إضافة ${product.name} للسلة!`);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
}

function updateQuantity(productId, delta) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      saveCart();
      updateCartUI();
    }
  }
}

function saveCart() {
  localStorage.setItem('luxure_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const cartCount = document.querySelector(".cart-count");

  if (!cartItems || !cartTotal) return;

  let total = 0;
  let count = 0;

  cartItems.innerHTML = cart.map(item => {
    total += item.price * item.quantity;
    count += item.quantity;
    return `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/60x80'" />
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <div class="price">$${item.price}</div>
          <div class="quantity-controls">
            <button onclick="updateQuantity(${item.id}, -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="updateQuantity(${item.id}, 1)">+</button>
          </div>
        </div>
        <button onclick="removeFromCart(${item.id})" class="remove-item"><i class="fas fa-trash"></i></button>
      </div>
    `;
  }).join("");

  cartTotal.textContent = `$${total.toLocaleString()}`;
  if(cartCount) cartCount.textContent = count;
}

// Checkout Logic
function showCheckout() {
  if (cart.length === 0) {
    showNotification("السلة فارغة!");
    return;
  }
  const modal = document.getElementById("checkoutModal");
  const overlay = document.getElementById("overlay");
  
  modal.classList.add("active");
  overlay.classList.add("active");
  
  document.getElementById("cartSidebar").classList.remove("open");
  document.getElementById("wishlistSidebar").classList.remove("open");
}

function closeCheckout() {
  document.getElementById("checkoutModal").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
}

function processPayment(event) {
  event.preventDefault();
  const btn = event.target.querySelector('button');
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = "جاري المعالجة...";
  
  setTimeout(() => {
    cart = [];
    saveCart();
    updateCartUI();
    window.location.href = "success.html";
  }, 2000);
}

// Notification
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.classList.add("show"), 100);
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => document.body.removeChild(notification), 400);
  }, 3000);
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    const targetId = this.getAttribute("href");
    if (targetId && targetId.startsWith("#")) {
      e.preventDefault();
      if (targetId === "#") return;
      const target = document.querySelector(targetId);
      if (target) {
        closeAllSidebars();
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
});
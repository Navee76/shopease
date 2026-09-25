/**
 * ShopEase - User Authentication & Session Management
 */

const USERS_STORAGE_KEY = 'shopease_users';
const SESSION_STORAGE_KEY = 'shopease_user';

// Get stored registered users
function getUsers() {
  try {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error loading users:', err);
    return [];
  }
}

// Get current logged-in user
function getCurrentUser() {
  try {
    const data = localStorage.getItem(SESSION_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('Error loading session:', err);
    return null;
  }
}

// Logout user
function logoutUser() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
  if (typeof showToast === 'function') {
    showToast('Logged out successfully');
  }
  setTimeout(() => {
    window.location.reload();
  }, 500);
}

// Update Navbar according to logged in user
function updateAuthNavbar() {
  const user = getCurrentUser();
  const userNavContainer = document.getElementById('user-nav-area');

  if (!userNavContainer) return;

  if (user) {
    userNavContainer.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <span style="color: #ffffff; font-size: 0.9rem; font-weight: 600;">
          👤 Hi, ${user.fullName.split(' ')[0]}
        </span>
        <button onclick="logoutUser()" class="btn btn-outline btn-sm" style="color: #ffffff; border-color: rgba(255,255,255,0.3);">
          Logout
        </button>
      </div>
    `;
  } else {
    userNavContainer.innerHTML = `
      <a href="login.html" class="btn btn-login-nav btn-sm">Login / Register</a>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateAuthNavbar();

  // Handle Login Form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      if (!email || !password) {
        alert('Please enter both email and password.');
        return;
      }

      const users = getUsers();
      const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

      if (matchedUser) {
        // Save current user session
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
          fullName: matchedUser.fullName,
          email: matchedUser.email,
          phone: matchedUser.phone
        }));

        if (typeof showToast === 'function') {
          showToast(`Welcome back, ${matchedUser.fullName}! 🎉`);
        } else {
          alert('Login successful!');
        }

        setTimeout(() => {
          window.location.href = 'index.html';
        }, 800);
      } else {
        // Fallback for easy demo testing if no registered users match
        if (email.includes('@') && password.length >= 4) {
          const demoUser = {
            fullName: email.split('@')[0].toUpperCase(),
            email: email,
            phone: '9876543210'
          };
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(demoUser));
          alert('Login successful!');
          window.location.href = 'index.html';
        } else {
          alert('Invalid email or password. If you do not have an account, please Register.');
        }
      }
    });
  }

  // Handle Register Form
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('reg-fullname').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const phone = document.getElementById('reg-phone').value.trim();
      const password = document.getElementById('reg-password').value;
      const confirmPassword = document.getElementById('reg-confirm-password').value;

      // Validation
      if (!fullName || !email || !phone || !password || !confirmPassword) {
        alert('Please fill in all registration fields.');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
        alert('Please enter a valid 10-digit phone number.');
        return;
      }

      if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
      }

      if (password !== confirmPassword) {
        alert('Passwords do not match. Please verify your password confirmation.');
        return;
      }

      const users = getUsers();
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        alert('An account with this email address already exists. Please login instead.');
        return;
      }

      // Add user
      const newUser = { fullName, email, phone, password };
      users.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

      // Auto login user
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone
      }));

      alert('Registration successful! Welcome to ShopEase 🎉');
      window.location.href = 'index.html';
    });
  }
});

window.logoutUser = logoutUser;
window.getCurrentUser = getCurrentUser;

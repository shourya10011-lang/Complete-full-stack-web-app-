/**
 * EduLearn - Authentication Management & Navbar State
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarAuth();
  initLoginForm();
  initDemoLogins();
});

// Sync Navbar with current login status
function initNavbarAuth() {
  const authContainer = document.getElementById('navbar-auth');
  if (!authContainer) return;

  const user = window.api.getCurrentUser();
  const token = window.api.getToken();

  if (token && user) {
    authContainer.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.875rem;">
        <a href="dashboard.html" class="btn btn-outline btn-sm" id="nav-dashboard-link">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          Dashboard
        </a>
        <a href="profile.html" class="user-menu-btn" title="View Profile" id="nav-profile-btn">
          <img src="${escapeHtml(user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100')}" class="user-avatar-sm" alt="${escapeHtml(user.name)}" />
          <span>${escapeHtml(user.name.split(' ')[0])}</span>
        </a>
        <button onclick="handleLogout()" class="btn btn-ghost btn-sm" title="Sign Out" id="nav-logout-btn">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        </button>
      </div>
    `;
  } else {
    authContainer.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <a href="login.html" class="btn btn-ghost btn-sm" id="nav-login-btn">Log In</a>
        <a href="login.html?tab=signup" class="btn btn-primary btn-sm" id="nav-signup-btn">Sign Up</a>
      </div>
    `;
  }
}

// Client-side route protection
function requireAuth() {
  const token = window.api.getToken();
  if (!token) {
    const currentPath = window.location.pathname + window.location.search;
    window.location.href = `login.html?redirect=${encodeURIComponent(currentPath)}`;
    return false;
  }
  return true;
}

// Handle Logout
function handleLogout() {
  window.api.setToken(null);
  window.api.setCurrentUser(null);
  showToast('You have been logged out.', 'info');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 500);
}

// Login & Signup Page Logic
function initLoginForm() {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const tabLogin = document.getElementById('tab-login');
  const tabSignup = document.getElementById('tab-signup');

  // URL tab param check (?tab=signup)
  const tabParam = getQueryParam('tab');
  if (tabParam === 'signup' && tabSignup) {
    switchAuthTab('signup');
  }

  if (tabLogin && tabSignup) {
    tabLogin.addEventListener('click', () => switchAuthTab('login'));
    tabSignup.addEventListener('click', () => switchAuthTab('signup'));
  }

  // Handle Login submission
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      const errorEl = document.getElementById('login-error');
      const submitBtn = loginForm.querySelector('button[type="submit"]');

      errorEl.textContent = '';
      submitBtn.disabled = true;
      submitBtn.textContent = 'Signing in...';

      try {
        const res = await window.api.post('/auth/login', { email, password });
        window.api.setToken(res.token);
        window.api.setCurrentUser(res.user);

        showToast('Login successful! Welcome back.', 'success');
        
        const redirect = getQueryParam('redirect') || 'dashboard.html';
        setTimeout(() => {
          window.location.href = redirect;
        }, 600);
      } catch (err) {
        errorEl.textContent = err.message || 'Invalid credentials. Please try again.';
        showToast(err.message || 'Login failed.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign In';
      }
    });
  }

  // Handle Signup submission
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value;
      const role = document.getElementById('signup-role')?.value || 'student';
      const errorEl = document.getElementById('signup-error');
      const submitBtn = signupForm.querySelector('button[type="submit"]');

      errorEl.textContent = '';
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating account...';

      try {
        const res = await window.api.post('/auth/signup', { name, email, password, role });
        window.api.setToken(res.token);
        window.api.setCurrentUser(res.user);

        showToast('Account created successfully! Welcome to EduLearn.', 'success');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 600);
      } catch (err) {
        errorEl.textContent = err.message || 'Registration failed.';
        showToast(err.message || 'Registration failed.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Account';
      }
    });
  }
}

// Switch between Login and Signup tabs
function switchAuthTab(type) {
  const tabLogin = document.getElementById('tab-login');
  const tabSignup = document.getElementById('tab-signup');
  const loginSection = document.getElementById('section-login');
  const signupSection = document.getElementById('section-signup');

  if (type === 'signup') {
    tabSignup?.classList.add('active');
    tabLogin?.classList.remove('active');
    loginSection?.style.setProperty('display', 'none');
    signupSection?.style.setProperty('display', 'block');
  } else {
    tabLogin?.classList.add('active');
    tabSignup?.classList.remove('active');
    loginSection?.style.setProperty('display', 'block');
    signupSection?.style.setProperty('display', 'none');
  }
}

// Quick Demo Login Fillers
function initDemoLogins() {
  const btnStudent = document.getElementById('btn-demo-student');
  const btnInstructor = document.getElementById('btn-demo-instructor');

  if (btnStudent) {
    btnStudent.addEventListener('click', () => {
      switchAuthTab('login');
      const emailEl = document.getElementById('login-email');
      const passEl = document.getElementById('login-password');
      if (emailEl && passEl) {
        emailEl.value = 'student@edulearn.com';
        passEl.value = 'Password123!';
        showToast('Filled demo student credentials. Click Sign In.', 'info');
      }
    });
  }

  if (btnInstructor) {
    btnInstructor.addEventListener('click', () => {
      switchAuthTab('login');
      const emailEl = document.getElementById('login-email');
      const passEl = document.getElementById('login-password');
      if (emailEl && passEl) {
        emailEl.value = 'sarah.jenkins@edulearn.com';
        passEl.value = 'Password123!';
        showToast('Filled demo instructor credentials. Click Sign In.', 'info');
      }
    });
  }
}

/**
 * E-Health Mental Wellness Platform
 * app.js — Main Bootstrap Orchestrator (ES Module Entry Point)
 *
 * Responsibilities:
 * - Import all modules and wire them together
 * - Initialize the centralized State Store
 * - Activate the Hash Router with all route definitions
 * - Render floating background medical emojis
 * - Handle auto-saving form drafts on the contact page
 * - Hook up global UI event listeners (Enter key, logout, sidebar)
 * - Bootstrap the entire application interface
 */

import { createStore, INITIAL_STATE } from './store.js';
import { createRouter } from './router.js';
import {
  isAuthenticated,
  getSession,
  login,
  logout,
  register,
  sanitize,
} from './security.js';
import { doctors, getDoctorById } from './doctors.js';
import {
  renderMessagesView,
  initChatListeners,
  startConversation,
} from './chat.js';
import { openBookingModal, getBookings } from './booking.js';
import { renderQuizView, initQuizListeners, resetQuiz } from './quiz.js';

// ============================================================================
// GLOBAL STATE STORE
// ============================================================================

/** The centralized application store */
const store = createStore(INITIAL_STATE);

// ============================================================================
// BACKGROUND EMOJIS
// ============================================================================

/**
 * Renders floating medical background emojis into the #bg-emojis container.
 */
function renderBackgroundEmojis() {
  const container = document.getElementById('bg-emojis');
  if (!container) return;

  const emojis = ['🩺', '💚', '🏥', '❤️', '💊', '🫀', '🧬', '💉', '🩻', '🩹'];
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < 20; i++) {
    const span = document.createElement('span');
    span.classList.add('bg-emoji');
    span.textContent = emojis[i % emojis.length];
    span.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      font-size: ${1.5 + Math.random() * 3}rem;
      --float-dur: ${8 + Math.random() * 16}s;
      --float-delay: ${Math.random() * 8}s;
    `;
    fragment.appendChild(span);
  }

  container.appendChild(fragment);
}

// ============================================================================
// ROUTER SETUP
// ============================================================================

/**
 * Renders a view into the main content area (#app-content).
 * @param {string} routeName - The resolved route name.
 * @param {Object} params - Route parameters.
 * @param {Object} state - Current store state.
 */
function renderView(routeName, params, state) {
  const content = document.getElementById('app-content');
  if (!content) return;

  let html = '';

  switch (routeName) {
    case 'login':
      html = renderLoginView();
      break;
    case 'dashboard':
      html = renderDashboardView(state);
      break;
    case 'home':
      html = renderHomeView();
      break;
    case 'doctors':
      html = renderDoctorsView();
      break;
    case 'messages':
      html = renderMessagesView(store, params);
      break;
    case 'profile':
      html = renderProfileView(state);
      break;
    case 'contact':
      html = renderContactView();
      break;
    case 'quiz':
      html = renderQuizView(store, router.navigateTo, startConversation);
      break;
    default:
      html = renderLoginView();
  }

  content.innerHTML = html;

  // Attach route-specific event listeners after DOM is updated
  setTimeout(() => {
    attachRouteListeners(routeName, params);
  }, 0);
}

/**
 * The router instance.
 */
const router = createRouter({
  store,
  isAuthenticated,
  renderView,
});

// Register all routes
router.addRoute('login', '#/login', {
  protected: false,
  title: 'Login',
});
router.addRoute('dashboard', '#/dashboard', {
  protected: true,
  title: 'Dashboard',
});
router.addRoute('home', '#/home', {
  protected: true,
  title: 'Home',
});
router.addRoute('doctors', '#/doctors', {
  protected: true,
  title: 'Doctors',
});
router.addRoute('messages', '#/messages', {
  protected: true,
  title: 'Messages',
});
router.addRoute('messages-conv', '#/messages/:doctorId', {
  protected: true,
  title: 'Messages',
});
router.addRoute('profile', '#/profile', {
  protected: true,
  title: 'Profile',
});
router.addRoute('contact', '#/contact', {
  protected: true,
  title: 'Contact',
});
router.addRoute('quiz', '#/quiz', {
  protected: true,
  title: 'Match Me Quiz',
});

// ============================================================================
// GLOBAL UI FUNCTIONS (exposed on window for inline handlers)
// ============================================================================

/**
 * Navigates to a chat with a specific doctor (called from sidebar/doctors).
 */
window._navigateToChat = function (doctorId) {
  store.setState({ activeChatDoctorId: doctorId });
  router.navigateTo(`#/messages/${doctorId}`);
};

/**
 * Opens the booking modal for a specific doctor.
 */
window._bookWithDoctor = function (doctorId) {
  openBookingModal(doctorId, store);
};

/**
 * Starts a chat from the quiz results.
 */
window._quizStartChat = function (doctorId) {
  startConversation(store, doctorId, router.navigateTo);
};

// ============================================================================
// VIEW RENDERERS
// ============================================================================

/**
 * Renders the Login/Register view.
 */
function renderLoginView() {
  return `
    <div class="page-view login-container">
      <div class="login-card" id="login-card">
        <span class="login-icon" aria-hidden="true">💚</span>
        <h1 id="login-title">Welcome Back</h1>
        <p class="login-subtitle" id="login-subtitle">Sign in to your E-Health account</p>
        <div id="login-alert" class="alert alert-error hidden"></div>
        <form id="login-form" novalidate>
          <div class="form-group" id="name-group" style="display:none;">
            <label for="auth-name">Full Name</label>
            <input type="text" id="auth-name" placeholder="Dr. Jane Smith" autocomplete="name" />
          </div>
          <div class="form-group">
            <label for="auth-email">Email</label>
            <input type="email" id="auth-email" placeholder="demo@ehealth.com" autocomplete="email" />
          </div>
          <div class="form-group">
            <label for="auth-password">Password</label>
            <input type="password" id="auth-password" placeholder="Enter your password" autocomplete="current-password" />
          </div>
          <button type="submit" class="btn-primary btn-full" id="auth-submit-btn">Sign In</button>
        </form>
        <div class="login-footer">
          <span id="toggle-text">Don't have an account?</span>
          <a href="#" id="toggle-auth-mode">Register</a>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders the Dashboard view.
 */
function renderDashboardView(state) {
  const user = state.currentUser || getSession();
  const userName = user ? sanitize(user.name || user.email) : 'Patient';
  const bookingCount = (state.bookings && state.bookings.length) || 0;
  const convCount = Object.keys(state.conversations || {}).length;

  return `
    <div class="page-view">
      <div class="dashboard-welcome">
        <h1>👋 Welcome back, ${userName}</h1>
        <p>Here's your health overview. Stay on top of your wellness journey.</p>
      </div>
      <div class="dashboard-grid">
        <div class="card card-hoverable dash-card" onclick="window.location.hash='#/doctors'">
          <span class="dash-card-icon">👨‍⚕️</span>
          <div class="dash-card-content">
            <h3>Find a Doctor</h3>
            <p>Browse 12 specialists and book consultations.</p>
          </div>
        </div>
        <div class="card card-hoverable dash-card" onclick="window.location.hash='#/quiz'">
          <span class="dash-card-icon">🔍</span>
          <div class="dash-card-content">
            <h3>Match Me Quiz</h3>
            <p>Get matched to the best specialist for your symptoms.</p>
          </div>
        </div>
        <div class="card card-hoverable dash-card" onclick="window.location.hash='#/messages'">
          <span class="dash-card-icon">💬</span>
          <div class="dash-card-content">
            <h3>Messages</h3>
            <p>${convCount} active conversation${convCount !== 1 ? 's' : ''}. Continue chatting with your doctors.</p>
          </div>
        </div>
        <div class="card card-hoverable dash-card" onclick="window.location.hash='#/profile'">
          <span class="dash-card-icon">📋</span>
          <div class="dash-card-content">
            <h3>Your Bookings</h3>
            <p>${bookingCount} consultation${bookingCount !== 1 ? 's' : ''} scheduled. View and manage appointments.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders the Home/About view.
 */
function renderHomeView() {
  return `
    <div class="page-view">
      <div class="dashboard-welcome">
        <h1>🏠 About E-Health</h1>
        <p>Your trusted platform for mental wellness and healthcare.</p>
      </div>
      <div class="doctors-grid" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));">
        <div class="card">
          <div style="font-size:2.5rem;margin-bottom:0.75rem;">🩺</div>
          <h3>Expert Doctors</h3>
          <p style="font-size:0.9rem;color:var(--text-light);">Access 12 board-certified specialists across multiple disciplines.</p>
        </div>
        <div class="card">
          <div style="font-size:2.5rem;margin-bottom:0.75rem;">💬</div>
          <h3>AI-Powered Chat</h3>
          <p style="font-size:0.9rem;color:var(--text-light);">Intelligent messaging system that connects you directly with medical professionals.</p>
        </div>
        <div class="card">
          <div style="font-size:2.5rem;margin-bottom:0.75rem;">🔍</div>
          <h3>Smart Matching</h3>
          <p style="font-size:0.9rem;color:var(--text-light);">Take our diagnostic quiz to be matched with the best specialist based on your symptoms.</p>
        </div>
        <div class="card">
          <div style="font-size:2.5rem;margin-bottom:0.75rem;">🔒</div>
          <h3>Secure & Private</h3>
          <p style="font-size:0.9rem;color:var(--text-light);">SHA-256 encryption, XSS sanitization, and 24-hour session management to protect your data.</p>
        </div>
        <div class="card">
          <div style="font-size:2.5rem;margin-bottom:0.75rem;">📅</div>
          <h3>Easy Booking</h3>
          <p style="font-size:0.9rem;color:var(--text-light);">Schedule consultations with your preferred doctor in just a few clicks.</p>
        </div>
        <div class="card">
          <div style="font-size:2.5rem;margin-bottom:0.75rem;">🧘</div>
          <h3>Mental Wellness</h3>
          <p style="font-size:0.9rem;color:var(--text-light);">Psychiatry and mental health specialists available for compassionate, confidential care.</p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders the Doctors directory view.
 */
function renderDoctorsView() {
  const doctorCards = doctors.map(doc => `
    <div class="card card-hoverable doctor-card">
      <div class="doctor-avatar-lg">${sanitize(doc.initials)}</div>
      <div class="doctor-info">
        <h3>${sanitize(doc.name)}</h3>
        <div class="doctor-specialty">${sanitize(doc.specialty)}</div>
        <div class="doctor-bio">${sanitize(doc.bio)}</div>
        <div class="doctor-meta">
          <span class="stars">${'★'.repeat(Math.round(doc.rating))}${'☆'.repeat(5 - Math.round(doc.rating))} <span style="color:var(--text);">${doc.rating.toFixed(1)}</span></span>
          ${doc.availability
            ? '<span class="available-badge">● Available</span>'
            : '<span class="unavailable-badge">● Unavailable</span>'
          }
        </div>
        <div style="display:flex;gap:0.5rem;margin-top:0.75rem;">
          <button class="btn-primary btn-sm" onclick="window._navigateToChat('${doc.id}')">💬 Chat</button>
          <button class="btn-secondary btn-sm" onclick="window._bookWithDoctor('${doc.id}')">📅 Book</button>
        </div>
      </div>
    </div>
  `).join('');

  return `
    <div class="page-view">
      <div class="doctors-header">
        <h1>👨‍⚕️ Doctors Directory</h1>
        <a href="#/quiz" class="btn-primary btn-sm">🔍 Match Me Quiz</a>
      </div>
      <div class="doctors-grid">
        ${doctorCards}
      </div>
    </div>
  `;
}

/**
 * Renders the Profile view.
 */
function renderProfileView(state) {
  const user = state.currentUser || getSession();
  if (!user) return '<div class="page-view"><p>Please log in.</p></div>';

  const bookings = getBookings();
  const bookingListHTML = bookings.length === 0
    ? '<p class="text-muted">No bookings yet.</p>'
    : bookings.map(b => `
      <div class="card" style="margin-bottom:0.75rem;padding:1rem;">
        <h4 style="margin-bottom:0.25rem;">${sanitize(b.doctorName)} — ${sanitize(b.doctorSpecialty)}</h4>
        <p style="font-size:0.85rem;color:var(--text-muted);">
          📅 ${formatDateDisplay(b.date)} | 🕐 ${sanitize(b.timeSlot)} | ${getTypeEmoji(b.type)} ${sanitize(b.type)}
        </p>
        <span class="available-badge" style="margin-top:0.25rem;">${sanitize(b.status)}</span>
      </div>
    `).join('');

  return `
    <div class="page-view profile-container">
      <div class="profile-header">
        <div class="profile-avatar-lg">${sanitize(user.initials || '?')}</div>
        <h1>${sanitize(user.name || 'User')}</h1>
        <p class="text-muted">${sanitize(user.email || '')}</p>
      </div>
      <div class="card" style="margin-bottom:1.5rem;">
        <h3 style="margin-bottom:1rem;">📋 Your Bookings</h3>
        ${bookingListHTML}
      </div>
      <div class="card">
        <h3 style="margin-bottom:1rem;">📊 Stats</h3>
        <p>Total Bookings: <strong>${bookings.length}</strong></p>
        <p>Active Conversations: <strong>${Object.keys(state.conversations || {}).length}</strong></p>
      </div>
    </div>
  `;
}

/**
 * Renders the Contact Form view.
 */
function renderContactView() {
  // Try to restore draft from localStorage
  let draftName = '';
  let draftEmail = '';
  let draftMessage = '';
  try {
    const draft = JSON.parse(localStorage.getItem('ehealth_form_draft') || '{}');
    draftName = sanitize(draft.name || '');
    draftEmail = sanitize(draft.email || '');
    draftMessage = sanitize(draft.message || '');
  } catch { /* ignore */ }

  return `
    <div class="page-view contact-container">
      <h1 style="margin-bottom:0.5rem;">📝 Contact Us</h1>
      <p style="color:var(--text-muted);margin-bottom:1.5rem;">Have a question or feedback? We'd love to hear from you.</p>
      <div class="card">
        <div id="contact-alert" class="alert alert-success hidden"></div>
        <form id="contact-form" novalidate>
          <div class="form-group">
            <label for="contact-name">Your Name</label>
            <input type="text" id="contact-name" placeholder="Jane Smith" value="${draftName}" maxlength="80" required />
          </div>
          <div class="form-group">
            <label for="contact-email">Your Email</label>
            <input type="email" id="contact-email" placeholder="jane@example.com" value="${draftEmail}" maxlength="120" required />
          </div>
          <div class="form-group">
            <label for="contact-message">Message</label>
            <textarea id="contact-message" placeholder="Tell us how we can help..." maxlength="600" required>${draftMessage}</textarea>
          </div>
          <div id="contact-error" class="alert alert-error hidden"></div>
          <button type="submit" class="btn-primary btn-full">Send Message</button>
        </form>
      </div>
    </div>
  `;
}

// ============================================================================
// ROUTE-SPECIFIC EVENT LISTENERS
// ============================================================================

/**
 * Attaches event listeners after a view is rendered.
 */
function attachRouteListeners(routeName, params) {
  switch (routeName) {
    case 'login':
      attachLoginListeners();
      break;
    case 'messages':
    case 'messages-conv': {
      const state = store.getState();
      const activeId = params.doctorId || state.activeChatDoctorId;
      if (activeId) {
        store.setState({ activeChatDoctorId: activeId });
      }
      initChatListeners(store, router.navigateTo);
      break;
    }
    case 'contact':
      attachContactListeners();
      break;
    case 'quiz':
      initQuizListeners(store, router.navigateTo, startConversation);
      break;
    case 'dashboard':
    case 'home':
    case 'doctors':
    case 'profile':
    default:
      // No special listeners needed
      break;
  }
}

/**
 * Attaches Login/Register form event listeners.
 */
function attachLoginListeners() {
  let isRegisterMode = false;
  const title = document.getElementById('login-title');
  const subtitle = document.getElementById('login-subtitle');
  const nameGroup = document.getElementById('name-group');
  const alertDiv = document.getElementById('login-alert');
  const authForm = document.getElementById('login-form');
  const submitBtn = document.getElementById('auth-submit-btn');
  const toggleText = document.getElementById('toggle-text');
  const toggleLink = document.getElementById('toggle-auth-mode');

  if (!authForm || !toggleLink) return;

  function updateMode() {
    if (isRegisterMode) {
      title.textContent = 'Create Account';
      subtitle.textContent = 'Join the E-Health community';
      nameGroup.style.display = 'flex';
      submitBtn.textContent = 'Register';
      toggleText.textContent = 'Already have an account? ';
      toggleLink.textContent = 'Sign In';
    } else {
      title.textContent = 'Welcome Back';
      subtitle.textContent = 'Sign in to your E-Health account';
      nameGroup.style.display = 'none';
      submitBtn.textContent = 'Sign In';
      toggleText.textContent = "Don't have an account? ";
      toggleLink.textContent = 'Register';
    }
    alertDiv.classList.add('hidden');
  }

  toggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    isRegisterMode = !isRegisterMode;
    updateMode();
  });

  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    alertDiv.classList.add('hidden');

    const email = document.getElementById('auth-email')?.value.trim() || '';
    const password = document.getElementById('auth-password')?.value || '';

    if (isRegisterMode) {
      const name = document.getElementById('auth-name')?.value.trim() || '';
      const result = await register(name, email, password);
      if (result.success) {
        alertDiv.innerHTML = '✓ Registration successful! Please sign in.';
        alertDiv.className = 'alert alert-success';
        alertDiv.classList.remove('hidden');
        isRegisterMode = false;
        updateMode();
      } else {
        showLoginError(result.error);
      }
    } else {
      const result = await login(email, password);
      if (result.success) {
        store.setState({ currentUser: result.user, bookings: getBookings() });
        updateUserUI(result.user);
        router.navigateTo('#/dashboard');
      } else {
        showLoginError(result.error);
      }
    }
  });

  function showLoginError(msg) {
    alertDiv.innerHTML = '⚠️ ' + sanitize(msg);
    alertDiv.className = 'alert alert-error';
    alertDiv.classList.remove('hidden');
    alertDiv.classList.add('shake');
    setTimeout(() => alertDiv.classList.remove('shake'), 500);
  }
}

/**
 * Attaches Contact Form event listeners with auto-save drafts.
 */
function attachContactListeners() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const successDiv = document.getElementById('contact-alert');
  const errorDiv = document.getElementById('contact-error');

  // Auto-save drafts on input
  const autoSave = () => {
    const draft = {
      name: nameInput?.value || '',
      email: emailInput?.value || '',
      message: messageInput?.value || '',
      savedAt: Date.now(),
    };
    localStorage.setItem('ehealth_form_draft', JSON.stringify(draft));
  };

  nameInput?.addEventListener('input', autoSave);
  emailInput?.addEventListener('input', autoSave);
  messageInput?.addEventListener('input', autoSave);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorDiv.classList.add('hidden');
    successDiv.classList.add('hidden');

    const name = nameInput?.value.trim() || '';
    const email = emailInput?.value.trim() || '';
    const message = messageInput?.value.trim() || '';

    if (!name || !email || !message) {
      errorDiv.innerHTML = '⚠️ Please fill in all fields.';
      errorDiv.classList.remove('hidden');
      errorDiv.classList.add('shake');
      setTimeout(() => errorDiv.classList.remove('shake'), 500);
      return;
    }

    // Increment form count
    const state = store.getState();
    store.setState({ formCount: (state.formCount || 0) + 1 });

    // Clear draft
    localStorage.removeItem('ehealth_form_draft');

    // Clear form
    nameInput.value = '';
    emailInput.value = '';
    messageInput.value = '';

    // Show success
    successDiv.innerHTML = '✓ Thank you! Your message has been sent. We\'ll get back to you soon.';
    successDiv.classList.remove('hidden');
  });
}

// ============================================================================
// GLOBAL EVENT LISTENERS
// ============================================================================

/**
 * Updates the topbar user UI elements.
 * @param {Object} user
 */
function updateUserUI(user) {
  const avatar = document.getElementById('user-avatar');
  const nameEl = document.getElementById('user-name');
  const topbarUser = document.getElementById('topbar-user');

  if (user) {
    if (avatar) avatar.textContent = user.initials || '?';
    if (nameEl) nameEl.textContent = user.name || user.email || 'User';
    if (topbarUser) topbarUser.style.display = 'flex';
  } else {
    if (avatar) avatar.textContent = '?';
    if (nameEl) nameEl.textContent = 'Guest';
  }
}

/**
 * Handles logout: destroys session, resets store, redirects to login.
 */
function handleLogout() {
  logout();
  store.setState({ currentUser: null });
  updateUserUI(null);
  router.navigateTo('#/login');
}

// ============================================================================
// BOOTSTRAP
// ============================================================================

/**
 * Initializes the entire application.
 */
function bootstrap() {
  // Render background emojis
  renderBackgroundEmojis();

  // Check for existing session
  const session = getSession();
  if (session) {
    store.setState({
      currentUser: session,
      bookings: getBookings(),
    });
    updateUserUI(session);
  } else {
    updateUserUI(null);
  }

  // Logout button
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }

  // Sidebar click handling — intercept links for SPA behavior
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // SPA navigation is handled by hashchange, so this is natural behavior
      // We just update aria-current after a brief delay to let the router handle it
    });
  });

  // Global Enter key shortcut for form submissions
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      // Ctrl+Enter: focus the first submit button on the page and click it
      const submitBtn = document.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.focus();
    }
  });

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const bookingModal = document.getElementById('booking-modal');
      const confirmOverlay = document.getElementById('confirm-overlay');
      if (confirmOverlay && !confirmOverlay.hasAttribute('hidden')) {
        confirmOverlay.setAttribute('hidden', '');
      } else if (bookingModal && !bookingModal.hasAttribute('hidden')) {
        bookingModal.setAttribute('hidden', '');
      }
    }
  });

  // Start the router
  router.start();
}

// Boot the application
bootstrap();

// ============================================================================
// UTILITY HELPERS (used in view rendering)
// ============================================================================

function formatDateDisplay(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getTypeEmoji(type) {
  switch (type) {
    case 'chat': return '💬';
    case 'voice': return '📞';
    case 'video': return '📹';
    default: return '';
  }
}
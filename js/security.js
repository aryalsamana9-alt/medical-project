/**
 * E-Health Mental Wellness Platform
 * security.js — Authentication, XSS Sanitization & Session Management
 *
 * Features:
 * - Demo credentials: demo@ehealth.com / password123
 * - SHA-256 password hashing via Web Crypto API
 * - XSS sanitization for all user inputs
 * - Session manager with 24-hour expiry (sessionStorage)
 * - Email registration with duplicate validation (localStorage)
 */

/**
 * Hardcoded demo credentials (SHA-256 hash of "password123").
 * Stored as hex to avoid plaintext passwords in code.
 */
const DEMO_EMAIL = 'demo@ehealth.com';
// SHA-256 of "password123" = "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f"
const DEMO_PASSWORD_HASH = 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f';

/** localStorage key for registered users */
const USERS_STORAGE_KEY = 'ehealth_users';

/** sessionStorage key for session data */
const SESSION_STORAGE_KEY = 'ehealth_session';

/** Session expiry duration: 24 hours in milliseconds */
const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000;

// ============================================================================
// XSS SANITIZATION
// ============================================================================

/**
 * Sanitizes a string to prevent XSS attacks by escaping HTML entities.
 * Uses a text node approach via DOMParser for robust sanitization.
 * @param {string} input - The potentially unsafe string.
 * @returns {string} The sanitized, HTML-safe string.
 */
export function sanitize(input) {
  if (typeof input !== 'string') return '';
  // Create a temporary element and set textContent — this escapes everything
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

/**
 * Sanitizes text for safe use as HTML content.
 * Alias for sanitize but explicitly for HTML context.
 * @param {string} input
 * @returns {string}
 */
export function sanitizeHTML(input) {
  return sanitize(input);
}

/**
 * Strips all HTML tags from a string (aggressive sanitization).
 * @param {string} input
 * @returns {string}
 */
export function stripTags(input) {
  if (typeof input !== 'string') return '';
  return input.replace(/<[^>]*>/g, '');
}

// ============================================================================
// PASSWORD HASHING (Web Crypto API — SHA-256)
// ============================================================================

/**
 * Hashes a plaintext password using SHA-256 via the Web Crypto API.
 * @param {string} plaintext - The plaintext password to hash.
 * @returns {Promise<string>} Hex-encoded SHA-256 hash.
 */
export async function hashPassword(plaintext) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return bufferToHex(hashBuffer);
}

/**
 * Converts an ArrayBuffer to a hex string.
 * @param {ArrayBuffer} buffer
 * @returns {string}
 */
function bufferToHex(buffer) {
  const bytes = new Uint8Array(buffer);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    const byteHex = bytes[i].toString(16).padStart(2, '0');
    hex += byteHex;
  }
  return hex;
}

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

/**
 * Creates a session for the given user and stores it in sessionStorage.
 * @param {Object} user - The authenticated user object.
 */
export function createSession(user) {
  const session = {
    email: user.email,
    name: user.name,
    initials: user.initials,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_EXPIRY_MS,
  };
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

/**
 * Retrieves the current session from sessionStorage, or null if invalid/expired.
 * @returns {Object|null}
 */
export function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw);

    // Check expiry
    if (Date.now() > session.expiresAt) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }

    return session;
  } catch (err) {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

/**
 * Destroys the current session by removing it from sessionStorage.
 */
export function destroySession() {
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
}

/**
 * Checks if there is a valid, non-expired session.
 * @returns {boolean}
 */
export function isAuthenticated() {
  return getSession() !== null;
}

// ============================================================================
// AUTHENTICATION
// ============================================================================

/**
 * Attempts to authenticate a user with email and password.
 * Checks demo credentials first, then falls back to registered users in localStorage.
 * @param {string} email - The user's email.
 * @param {string} plainPassword - The plaintext password (will be hashed before comparison).
 * @returns {Promise<{ success: boolean, user?: Object, error?: string }>}
 */
export async function login(email, plainPassword) {
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedEmail || !plainPassword) {
    return { success: false, error: 'Please enter both email and password.' };
  }

  const passwordHash = await hashPassword(plainPassword);

  // Check demo credentials
  if (trimmedEmail === DEMO_EMAIL) {
    if (passwordHash === DEMO_PASSWORD_HASH) {
      const user = {
        email: DEMO_EMAIL,
        name: 'Demo User',
        initials: 'DU',
      };
      createSession(user);
      return { success: true, user };
    } else {
      return { success: false, error: 'Invalid password. Please try again.' };
    }
  }

  // Check registered users
  const users = getRegisteredUsers();
  const existingUser = users.find(u => u.email === trimmedEmail);

  if (!existingUser) {
    return { success: false, error: 'No account found with this email. Please register first.' };
  }

  if (existingUser.passwordHash !== passwordHash) {
    return { success: false, error: 'Invalid password. Please try again.' };
  }

  const user = {
    email: existingUser.email,
    name: existingUser.name,
    initials: existingUser.initials,
  };

  createSession(user);
  return { success: true, user };
}

/**
 * Logs out the current user by destroying the session.
 */
export function logout() {
  destroySession();
}

// ============================================================================
// REGISTRATION
// ============================================================================

/**
 * Registers a new user in localStorage.
 * @param {string} name - The user's full name.
 * @param {string} email - The user's email.
 * @param {string} plainPassword - The plaintext password.
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function register(name, email, plainPassword) {
  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();

  // Validation
  if (!trimmedName || trimmedName.length < 2) {
    return { success: false, error: 'Please enter your full name (at least 2 characters).' };
  }

  if (!isValidEmail(trimmedEmail)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  if (plainPassword.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' };
  }

  // Check duplicate email (including demo account)
  if (trimmedEmail === DEMO_EMAIL) {
    return { success: false, error: 'This email is already registered. Please login instead.' };
  }

  const users = getRegisteredUsers();
  if (users.find(u => u.email === trimmedEmail)) {
    return { success: false, error: 'An account with this email already exists. Please login.' };
  }

  // Generate initials
  const initials = generateInitials(trimmedName);

  // Hash password
  const passwordHash = await hashPassword(plainPassword);

  // Store user
  const newUser = {
    email: trimmedEmail,
    name: trimmedName,
    initials,
    passwordHash,
    registeredAt: Date.now(),
  };

  users.push(newUser);
  saveRegisteredUsers(users);

  return { success: true };
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Retrieves registered users from localStorage.
 * @returns {Array<Object>}
 */
function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Saves the registered users array to localStorage.
 * @param {Array<Object>} users
 */
function saveRegisteredUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

/**
 * Validates an email format.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generates initials from a full name (e.g., "John Doe" → "JD").
 * @param {string} name
 * @returns {string}
 */
function generateInitials(name) {
  const parts = name.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}
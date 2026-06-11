/**
 * E-Health Mental Wellness Platform
 * router.js — Custom Hash-Based SPA Router
 *
 * Features:
 * - Hash-based routing (e.g., #/doctors, #/messages)
 * - Bookmarkable URLs
 * - Browser back/forward button support
 * - Route guards for protected routes (redirect to #/login if no session)
 * - Dynamic document title updates
 */

/**
 * Creates a hash-based router.
 * @param {Object} options
 * @param {Object} options.store - The centralized state store.
 * @param {Function} options.isAuthenticated - Function returning true if user has valid session.
 * @param {Function} options.renderView - Function to render a view into the main content area.
 * @returns {{ start: Function, navigateTo: Function, getCurrentRoute: Function }}
 */
export function createRouter({ store, isAuthenticated, renderView }) {
  /** Map of route patterns to handler configs */
  const routes = new Map();

  /** Current matched route name */
  let currentRoute = null;

  /** Whether the initial route has been handled */
  let initialized = false;

  /**
   * Registers a route.
   * @param {string} name - Unique route name (e.g., 'dashboard').
   * @param {string} pattern - Hash pattern (e.g., '#/dashboard').
   * @param {Object} config
   * @param {boolean} config.protected - Whether auth is required.
   * @param {string} config.title - Document title for this route.
   * @param {Function} config.view - Function returning an HTML string or DOM element.
   * @param {Function} [config.onEnter] - Optional callback when entering route.
   */
  function addRoute(name, pattern, config) {
    routes.set(pattern, { name, ...config });
  }

  /**
   * Resolves the current hash to a matching route.
   * @returns {{ config: Object, params: Object } | null}
   */
  function resolveRoute() {
    let hash = window.location.hash || '#/login';
    // Strip any query-like portion for simple matching
    const queryIndex = hash.indexOf('?');
    const cleanHash = queryIndex !== -1 ? hash.substring(0, queryIndex) : hash;

    // Direct match
    if (routes.has(cleanHash)) {
      return { config: routes.get(cleanHash), params: {} };
    }

    // Parameterized match (e.g., #/messages/doctor-1)
    for (const [pattern, config] of routes) {
      const paramMatch = matchPattern(pattern, cleanHash);
      if (paramMatch) {
        return { config, params: paramMatch };
      }
    }

    return null;
  }

  /**
   * Attempts parameterized route matching.
   * e.g., pattern '#/messages/:doctorId' matches '#/messages/doc-1' → { doctorId: 'doc-1' }
   */
  function matchPattern(pattern, hash) {
    const patternParts = pattern.split('/');
    const hashParts = hash.split('/');

    if (patternParts.length !== hashParts.length) return null;

    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        const paramName = patternParts[i].slice(1);
        params[paramName] = hashParts[i];
      } else if (patternParts[i] !== hashParts[i]) {
        return null;
      }
    }
    return params;
  }

  /**
   * Handles the current route: checks auth, renders the view, updates UI.
   */
  function handleRoute() {
    const resolved = resolveRoute();

    // If no route matched, redirect to dashboard or login
    if (!resolved) {
      const authenticated = isAuthenticated();
      window.location.hash = authenticated ? '#/dashboard' : '#/login';
      return;
    }

    const { config, params } = resolved;

    // Route guard: redirect to login if protected and not authenticated
    if (config.protected && !isAuthenticated()) {
      window.location.hash = '#/login';
      return;
    }

    // If already authenticated and trying to access login, redirect to dashboard
    if (config.name === 'login' && isAuthenticated()) {
      window.location.hash = '#/dashboard';
      return;
    }

    // Update document title
    document.title = `${config.title} | E-Health`;

    // Update sidebar active state
    updateSidebarActive(config.name);

    // Call onEnter hook if provided
    if (config.onEnter) {
      config.onEnter(params, store.getState());
    }

    // Render the view
    renderView(config.name, params, store.getState());

    // Track current route
    currentRoute = config.name;

    initialized = true;
  }

  /**
   * Updates the sidebar link aria-current attributes.
   */
  function updateSidebarActive(routeName) {
    const links = document.querySelectorAll('.sidebar-link');
    for (const link of links) {
      const linkRoute = link.getAttribute('data-route');
      if (linkRoute === routeName) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    }
  }

  /**
   * Programmatically navigates to a route.
   * @param {string} hash - The hash to navigate to (e.g., '#/doctors').
   */
  function navigateTo(hash) {
    window.location.hash = hash;
  }

  /**
   * Starts the router: listens for hash changes and handles initial route.
   */
  function start() {
    // Listen for hash changes (including back/forward)
    window.addEventListener('hashchange', () => {
      handleRoute();
    });

    // Handle initial route (or default)
    handleRoute();

    // If no hash at all, set default
    if (!window.location.hash) {
      const authenticated = isAuthenticated();
      navigateTo(authenticated ? '#/dashboard' : '#/login');
    }
  }

  /**
   * Returns the current route name.
   * @returns {string|null}
   */
  function getCurrentRoute() {
    return currentRoute;
  }

  return {
    addRoute,
    start,
    navigateTo,
    getCurrentRoute,
    handleRoute,
  };
}

export default createRouter;
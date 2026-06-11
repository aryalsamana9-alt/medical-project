/**
 * E-Health Mental Wellness Platform
 * store.js — Centralized State Manager (Pub/Sub Pattern)
 *
 * Serves as the single source of truth for the entire application.
 * Any UI component must look to this store for reactive updates.
 */

/**
 * Creates a centralized store with a Pub/Sub pattern.
 * @param {Object} initialState - The initial state object.
 * @returns {{ getState: Function, setState: Function, subscribe: Function }}
 */
export function createStore(initialState) {
  let state = { ...initialState };
  const listeners = new Set();

  /**
   * Returns a shallow copy of the current state.
   * @returns {Object}
   */
  function getState() {
    return { ...state };
  }

  /**
   * Merges partial updates into the state and notifies all subscribers.
   * @param {Object} partial - Partial state to merge.
   */
  function setState(partial) {
    const prevState = { ...state };
    state = { ...state, ...partial };

    // Notify all listeners with the new state and previous state
    for (const listener of listeners) {
      try {
        listener(state, prevState);
      } catch (err) {
        console.error('[Store] Listener error:', err);
      }
    }
  }

  /**
   * Subscribes a callback to state changes.
   * @param {Function} listener - Callback receiving (newState, prevState).
   * @returns {Function} Unsubscribe function.
   */
  function subscribe(listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }

  return { getState, setState, subscribe };
}

/**
 * Initial application state.
 */
export const INITIAL_STATE = {
  /** Currently authenticated user object (null if not logged in) */
  currentUser: null,

  /**
   * Conversations map keyed by doctor ID.
   * Each conversation: { doctorId: string, messages: Array<{sender, text, timestamp}> }
   */
  conversations: {},

  /** Booking array for the current user */
  bookings: [],

  /** Accumulated form submissions count (for the contact page) */
  formCount: 0,

  /** Whether the AI is currently "typing" a reply */
  isAITyping: false,

  /** Current active conversation doctor ID in the messages view */
  activeChatDoctorId: null,

  /** Quiz state: user's accumulated symptom scores per doctor */
  quizAnswers: [],

  /** Whether the quiz has been completed in the current session */
  quizCompleted: false,
};

export default createStore;
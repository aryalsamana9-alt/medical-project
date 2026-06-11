/**
 * E-Health Mental Wellness Platform
 * chat.js — AI-Powered Dual-Pane Messaging System
 *
 * Features:
 * - Left sidebar: conversation list with truncated last-message previews & timestamps
 * - Right pane: active chat bubble interface
 * - AI auto-reply with keyword matching against doctor specialties (2x weight)
 * - Contextual message prefixing (sympathy for pain, clarifying for questions)
 * - "Doctor is typing..." bouncing dot indicator with random 0.8–2.3s delay
 */

import { getDoctorById } from './doctors.js';
import { sanitize } from './security.js';

/**
 * Renders the full messages view including conversation sidebar and chat pane.
 * @param {Object} store - The centralized store.
 * @param {Object} [params={}] - Route params (e.g., { doctorId }).
 * @returns {string} HTML string for the messages view.
 */
export function renderMessagesView(store, params = {}) {
  const state = store.getState();
  const { conversations, activeChatDoctorId } = state;

  const activeDoctorId = params.doctorId || activeChatDoctorId;
  const conversationIds = Object.keys(conversations);

  // Build sidebar
  let sidebarHTML = '';
  if (conversationIds.length === 0) {
    sidebarHTML = `
      <div class="chat-empty-state" style="padding: 2rem; text-align: center;">
        <div class="chat-empty-icon">💬</div>
        <p style="font-size: 0.9rem;">No conversations yet.</p>
        <p style="font-size: 0.8rem;">Start a chat with a doctor from the Doctors page or take the "Match Me" quiz.</p>
      </div>
    `;
  } else {
    sidebarHTML = conversationIds.map(docId => {
      const conv = conversations[docId];
      const doctor = getDoctorById(docId);
      if (!doctor || !conv.messages || conv.messages.length === 0) return '';

      const lastMsg = conv.messages[conv.messages.length - 1];
      const preview = lastMsg.text.length > 40
        ? sanitize(lastMsg.text.substring(0, 40)) + '...'
        : sanitize(lastMsg.text);
      const time = formatTime(lastMsg.timestamp);
      const isActive = docId === activeDoctorId;

      return `
        <div class="conversation-item ${isActive ? 'active' : ''}"
             data-doctor-id="${docId}"
             onclick="window._navigateToChat('${docId}')">
          <div class="conv-avatar">${sanitize(doctor.initials)}</div>
          <div class="conv-info">
            <div class="conv-name">${sanitize(doctor.name)}</div>
            <div class="conv-preview">${preview}</div>
          </div>
          <div class="conv-time">${time}</div>
        </div>
      `;
    }).join('');
  }

  // Build active chat
  let chatHTML = '';
  if (activeDoctorId && conversations[activeDoctorId]) {
    const doctor = getDoctorById(activeDoctorId);
    const conv = conversations[activeDoctorId];

    if (doctor) {
      const messagesHTML = conv.messages.map(msg => {
        const isSent = msg.sender === 'user';
        const bubbleClass = isSent ? 'sent' : 'received';
        const senderLabel = isSent ? 'You' : sanitize(doctor.name);
        return `
          <div class="chat-bubble ${bubbleClass}" title="${senderLabel} — ${formatFullTime(msg.timestamp)}">
            ${sanitize(msg.text)}
          </div>
        `;
      }).join('');

      chatHTML = `
        <div class="chat-main-header">
          <div style="display:flex;align-items:center;gap:0.75rem;">
            <div class="conv-avatar" style="width:40px;height:40px;">${sanitize(doctor.initials)}</div>
            <div>
              <h4 style="margin:0;">${sanitize(doctor.name)}</h4>
              <span style="font-size:0.8rem;color:var(--text-muted);">${sanitize(doctor.specialty)}</span>
            </div>
          </div>
          <button class="btn-secondary btn-sm" onclick="window._bookWithDoctor('${activeDoctorId}')">📅 Book</button>
        </div>
        <div class="chat-messages" id="chat-messages-list">
          ${messagesHTML}
        </div>
        <div class="typing-indicator hidden" id="typing-indicator">
          <span>Doctor is typing</span>
          <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>
        </div>
        <div class="chat-input-area">
          <input
            type="text"
            id="chat-input"
            placeholder="Type your message..."
            maxlength="500"
            autocomplete="off"
          />
          <button class="chat-send-btn" id="chat-send-btn" title="Send message">➤</button>
        </div>
      `;
    }
  }

  if (!chatHTML && activeDoctorId) {
    chatHTML = `
      <div class="chat-empty-state">
        <div class="chat-empty-icon">💬</div>
        <p>Select a conversation or start a new one.</p>
      </div>
    `;
  } else if (!chatHTML) {
    chatHTML = `
      <div class="chat-empty-state">
        <div class="chat-empty-icon">💬</div>
        <h3>Your Messages</h3>
        <p>Start chatting with a healthcare professional.</p>
        <a href="#/doctors" class="btn-primary btn-sm mt-2">Find a Doctor</a>
      </div>
    `;
  }

  return `
    <div class="page-view">
      <h1 style="margin-bottom:1.5rem;">💬 Messages</h1>
      <div class="chat-container">
        <div class="chat-sidebar-pane">
          <div class="chat-sidebar-header">
            <h3>Conversations</h3>
          </div>
          <div class="conversation-list" id="conversation-list">
            ${sidebarHTML}
          </div>
        </div>
        <div class="chat-main-pane">
          ${chatHTML}
        </div>
      </div>
    </div>
  `;
}

/**
 * Initializes chat event listeners after the messages view is rendered.
 * @param {Object} store - The centralized store.
 * @param {Function} navigateTo - Router navigateTo function.
 */
export function initChatListeners(store, navigateTo) {
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');

  if (!chatInput || !sendBtn) return;

  // Helper to send message
  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    const state = store.getState();
    const activeDoctorId = state.activeChatDoctorId;
    if (!activeDoctorId) return;

    const doctor = getDoctorById(activeDoctorId);
    if (!doctor) return;

    // Sanitize user input
    const sanitizedText = sanitize(text);

    // Add user message to conversation
    const conversations = { ...state.conversations };
    if (!conversations[activeDoctorId]) {
      conversations[activeDoctorId] = { doctorId: activeDoctorId, messages: [] };
    }

    const userMsg = {
      sender: 'user',
      text: sanitizedText,
      timestamp: Date.now(),
    };

    conversations[activeDoctorId] = {
      ...conversations[activeDoctorId],
      messages: [...conversations[activeDoctorId].messages, userMsg],
    };

    store.setState({ conversations });

    // Clear input
    chatInput.value = '';
    chatInput.focus();

    // Show typing indicator
    store.setState({ isAITyping: true });
    showTypingIndicator();

    // Generate AI reply after artificial delay
    const delay = 800 + Math.random() * 1500; // 0.8–2.3 seconds
    setTimeout(() => {
      const replyText = getAIReply(sanitizedText, doctor);
      const aiMsg = {
        sender: 'doctor',
        text: replyText,
        timestamp: Date.now(),
      };

      const updatedConversations = { ...store.getState().conversations };
      updatedConversations[activeDoctorId] = {
        ...updatedConversations[activeDoctorId],
        messages: [...updatedConversations[activeDoctorId].messages, aiMsg],
      };

      store.setState({ conversations: updatedConversations, isAITyping: false });
      hideTypingIndicator();
      scrollChatToBottom();
    }, delay);
  }

  // Send button click
  sendBtn.addEventListener('click', sendMessage);

  // Enter key
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Scroll to bottom on initial render
  scrollChatToBottom();
}

/**
 * Generates an intelligent AI reply based on user message and doctor specialty.
 * @param {string} userMessage - The sanitized user message.
 * @param {Object} doctor - The doctor profile object.
 * @returns {string} The generated AI reply text.
 */
export function getAIReply(userMessage, doctor) {
  const lowerMsg = userMessage.toLowerCase();

  // Check for question marks
  const hasQuestion = userMessage.includes('?');

  // Check for pain/hurt keywords
  const hasPain = /\b(pain|hurt|ache|sore|uncomfortable|burning|stabbing|throbbing|cramp)\b/i.test(lowerMsg);

  // Check for emergency keywords
  const isEmergency = /\b(emergency|urgent|immediately|severe|can't breathe|chest pain|stroke|bleeding)\b/i.test(lowerMsg);

  // Keyword matching against doctor's specialty keywords (2x weight)
  const userWords = lowerMsg.split(/[\s,.;:!?]+/).filter(w => w.length > 2);
  let bestReply = null;
  let bestScore = -1;

  for (const reply of doctor.replies) {
    const replyLower = reply.toLowerCase();
    let score = 0;

    // Score based on keyword overlap with 2x weight for matching doctor keywords
    for (const word of userWords) {
      if (replyLower.includes(word)) {
        // Check if word is in doctor's keywords for 2x weight
        const isSpecialtyKeyword = doctor.keywords.some(k => k.toLowerCase().includes(word) || word.includes(k.toLowerCase()));
        score += isSpecialtyKeyword ? 2 : 1;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestReply = reply;
    }
  }

  // Fallback: pick a random reply if no matches
  if (!bestReply) {
    bestReply = doctor.replies[Math.floor(Math.random() * doctor.replies.length)];
  }

  // Build contextual prefix
  let prefix = '';
  if (isEmergency) {
    prefix = '⚠️ If this is a medical emergency, please call emergency services immediately. ';
  }
  if (hasPain) {
    prefix += 'I understand you\'re experiencing discomfort — that can be very concerning. ';
  }
  if (hasQuestion) {
    prefix += 'That\'s an excellent question. ';
  }

  return prefix + bestReply;
}

/**
 * Shows the "Doctor is typing..." indicator.
 */
function showTypingIndicator() {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) {
    indicator.classList.remove('hidden');
  }
}

/**
 * Hides the "Doctor is typing..." indicator.
 */
function hideTypingIndicator() {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) {
    indicator.classList.add('hidden');
  }
}

/**
 * Scrolls the chat messages list to the bottom.
 */
function scrollChatToBottom() {
  const messagesList = document.getElementById('chat-messages-list');
  if (messagesList) {
    messagesList.scrollTop = messagesList.scrollHeight;
  }
}

/**
 * Formats a timestamp as a relative time string (e.g., "2m ago").
 * @param {number} timestamp
 * @returns {string}
 */
function formatTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'Just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/**
 * Formats a timestamp as a full date/time string.
 * @param {number} timestamp
 * @returns {string}
 */
function formatFullTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Starts a conversation with a doctor (called from doctors page or quiz results).
 * @param {Object} store - The centralized store.
 * @param {string} doctorId - The doctor's ID to start chat with.
 * @param {Function} navigateTo - Router navigateTo function.
 */
export function startConversation(store, doctorId, navigateTo) {
  const state = store.getState();
  const conversations = { ...state.conversations };

  // Create conversation if it doesn't exist
  if (!conversations[doctorId]) {
    const doctor = getDoctorById(doctorId);
    if (!doctor) return;

    // Add a welcome message from the doctor
    const welcomeMsg = {
      sender: 'doctor',
      text: `Hello! I'm ${doctor.name}, ${doctor.specialty}. How can I help you today? Feel free to describe your symptoms or ask any health-related questions.`,
      timestamp: Date.now(),
    };

    conversations[doctorId] = {
      doctorId,
      messages: [welcomeMsg],
    };
  }

  store.setState({
    conversations,
    activeChatDoctorId: doctorId,
  });

  navigateTo(`#/messages/${doctorId}`);
}

export default {
  renderMessagesView,
  initChatListeners,
  getAIReply,
  startConversation,
};
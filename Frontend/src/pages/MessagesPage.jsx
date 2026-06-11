import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMedical } from '../context/MedicalContext';
import { getDoctorById } from '../data/doctors';

/**
 * AI Reply Engine:
 * - Parses user message against doctor's keywords (2x weight for matches)
 * - Adds contextual prefixes (sympathy for pain, clarifying for questions)
 * - Picks the best-matching reply from the doctor's replies array
 */
function getAIReply(userMessage, doctor) {
  const lowerMsg = userMessage.toLowerCase();
  const hasQuestion = userMessage.includes('?');
  const hasPain = /\b(pain|hurt|ache|sore|uncomfortable|burning|stabbing|throbbing|cramp)\b/i.test(lowerMsg);
  const isEmergency = /\b(emergency|urgent|immediately|severe|can't breathe|chest pain|stroke|bleeding)\b/i.test(lowerMsg);

  const userWords = lowerMsg.split(/[\s,.;:!?]+/).filter((w) => w.length > 2);

  let bestReply = null;
  let bestScore = -1;

  for (const reply of doctor.replies) {
    const replyLower = reply.toLowerCase();
    let score = 0;
    for (const word of userWords) {
      if (replyLower.includes(word)) {
        const isKw = doctor.keywords.some((k) => k.toLowerCase().includes(word) || word.includes(k.toLowerCase()));
        score += isKw ? 2 : 1;
      }
    }
    if (score > bestScore) { bestScore = score; bestReply = reply; }
  }

  if (!bestReply) {
    bestReply = doctor.replies[Math.floor(Math.random() * doctor.replies.length)];
  }

  let prefix = '';
  if (isEmergency) prefix = '⚠️ If this is a medical emergency, please call emergency services immediately. ';
  if (hasPain) prefix += "I understand you're experiencing discomfort — that can be very concerning. ";
  if (hasQuestion) prefix += "That's an excellent question. ";

  return prefix + bestReply;
}

function formatTime(ts) {
  const diff = Date.now() - ts;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return 'Just now';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}

export default function MessagesPage() {
  const navigate = useNavigate();
  const {
    doctors, activeChatDoctorId, setActiveChatDoctorId,
    conversations, addMessage, startConversation, isAITyping, setIsAITyping,
    openBookingForDoctor,
  } = useMedical();

  const [draft, setDraft] = useState('');
  /** On mobile, when the user opens a chat, we hide the doctor list. */
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const activeConv = activeChatDoctorId ? conversations[activeChatDoctorId] : null;
  const activeDoctor = activeChatDoctorId ? getDoctorById(activeChatDoctorId) : null;

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages]);

  // Focus input when switching conversations
  useEffect(() => {
    if (activeChatDoctorId) {
      inputRef.current?.focus();
      setMobileShowChat(true);
    }
  }, [activeChatDoctorId]);

  const handleSelectDoctor = (docId) => {
    if (!conversations[docId]) startConversation(docId);
    else setActiveChatDoctorId(docId);
  };

  const handleBackToList = () => {
    setMobileShowChat(false);
    setActiveChatDoctorId(null);
  };

  const handleSend = useCallback(() => {
    const text = draft.trim();
    if (!text || !activeChatDoctorId || isAITyping) return;

    const userMsg = { sender: 'user', text, timestamp: Date.now() };
    addMessage(activeChatDoctorId, userMsg);
    setDraft('');

    // AI typing simulation
    setIsAITyping(true);
    const delay = 800 + Math.random() * 1500; // 0.8–2.3s
    setTimeout(() => {
      const doc = getDoctorById(activeChatDoctorId);
      if (!doc) { setIsAITyping(false); return; }
      const reply = getAIReply(text, doc);
      const aiMsg = { sender: 'doctor', text: reply, timestamp: Date.now() };
      addMessage(activeChatDoctorId, aiMsg);
      setIsAITyping(false);
    }, delay);
  }, [draft, activeChatDoctorId, isAITyping, addMessage, setIsAITyping]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ==========================================================================
  // RENDER: Doctor list sidebar (shared by both mobile & desktop via CSS)
  // ==========================================================================
  const renderDoctorList = () => (
    <div className="msg-sidebar">
      <div className="msg-sidebar-header">
        <h3>Doctors</h3>
      </div>
      <div className="msg-sidebar-list">
        {doctors.map((doc) => {
          const conv = conversations[doc.id];
          const lastMsg = conv?.messages?.[conv.messages.length - 1];
          const isActive = doc.id === activeChatDoctorId;
          return (
            <div
              key={doc.id}
              onClick={() => handleSelectDoctor(doc.id)}
              className={`msg-conversation ${isActive ? 'msg-conversation-active' : ''}`}
            >
              <div className="msg-conversation-avatar">
                {doc.initials}
              </div>
              <div className="msg-conversation-body">
                <div className="msg-conversation-name">{doc.name}</div>
                <div className="msg-conversation-specialty">{doc.specialty}</div>
                {lastMsg && (
                  <div className="msg-conversation-preview">
                    {lastMsg.text.substring(0, 40)}{lastMsg.text.length > 40 ? '...' : ''}
                  </div>
                )}
              </div>
              <div className="msg-conversation-meta">
                <span
                  className={`msg-availability-dot ${doc.isAvailable ? 'msg-available' : 'msg-unavailable'}`}
                />
                {lastMsg && <span className="msg-conversation-time">{formatTime(lastMsg.timestamp)}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ==========================================================================
  // RENDER: Main chat pane
  // ==========================================================================
  const renderChatPane = () => {
    if (!activeDoctor) {
      return (
        <div className="msg-empty-chat">
          <div className="msg-empty-chat-icon">💬</div>
          <h3>Your Messages</h3>
          <p>Select a doctor from the list to start chatting.</p>
          <button className="btn-primary" onClick={() => navigate('/doctors')}>Find a Doctor</button>
        </div>
      );
    }

    return (
      <>
        {/* Chat header */}
        <div className="msg-chat-header">
          <div className="msg-chat-header-left">
            {/* Back button — visible only on mobile */}
            <button
              className="msg-back-btn"
              onClick={handleBackToList}
              aria-label="Back to doctor list"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
            <div className="msg-chat-avatar">
              {activeDoctor.initials}
            </div>
            <div className="msg-chat-header-info">
              <h4>{activeDoctor.name}</h4>
              <span>{activeDoctor.specialty}</span>
            </div>
          </div>
          <button className="btn-secondary btn-sm" onClick={() => openBookingForDoctor(activeDoctor.id)}>
            📅 Book
          </button>
        </div>

        {/* Messages */}
        <div className="msg-chat-body">
          {!activeConv?.messages?.length && (
            <div className="msg-chat-empty-state">
              <div>💬</div>
              <p>Send a message to start your consultation.</p>
            </div>
          )}
          {activeConv?.messages?.map((msg, i) => (
            <div
              key={i}
              className={`msg-bubble ${msg.sender === 'user' ? 'msg-bubble-sent' : 'msg-bubble-received'}`}
            >
              {msg.text}
              <div className="msg-bubble-time">
                {formatTime(msg.timestamp)}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isAITyping && (
            <div className="msg-typing-indicator">
              <span>Doctor is typing</span>
              <span className="msg-typing-dots">
                <span /><span /><span />
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="msg-chat-input">
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            maxLength={500}
          />
          <button
            onClick={handleSend}
            disabled={!draft.trim() || isAITyping}
            className="msg-send-btn"
            aria-label="Send message"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="content-page msg-page">
      <div className="msg-page-header">
        <h1>💬 Messages</h1>
      </div>

      {/* ============ MASTER-DETAIL LAYOUT ============ */}
      <div className="msg-master-detail">
        {/* Doctor List — hidden on mobile when chat is active */}
        <div className={`msg-pane-list ${mobileShowChat && activeDoctor ? 'msg-pane-list--hidden-mobile' : ''}`}>
          {renderDoctorList()}
        </div>

        {/* Chat Pane — hidden on mobile when no chat is selected */}
        <div className={`msg-pane-chat ${!mobileShowChat || !activeDoctor ? 'msg-pane-chat--hidden-mobile' : ''}`}>
          {renderChatPane()}
        </div>
      </div>
    </div>
  );
}
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
    inputRef.current?.focus();
  }, [activeChatDoctorId]);

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

  return (
    <div className="content-page" style={{ padding: 0 }}>
      <h1 style={{ marginBottom: '1rem', padding: '0 0 0 0' }}>💬 Messages</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: '1px',
        background: 'var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        minHeight: '65vh',
        boxShadow: 'var(--shadow-md)',
      }}>
        {/* ----- SIDEBAR: Doctor list ----- */}
        <div style={{ background: 'var(--card-bg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1rem', margin: 0 }}>Doctors</h3>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
            {doctors.map((doc) => {
              const conv = conversations[doc.id];
              const lastMsg = conv?.messages?.[conv.messages.length - 1];
              const isActive = doc.id === activeChatDoctorId;
              return (
                <div
                  key={doc.id}
                  onClick={() => {
                    if (!conversations[doc.id]) startConversation(doc.id);
                    else setActiveChatDoctorId(doc.id);
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.75rem', borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer', background: isActive ? 'var(--primary-light)' : 'transparent',
                    transition: 'background var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--bg-alt)'; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0,
                  }}>
                    {doc.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-h)' }}>
                      {doc.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 500 }}>
                      {doc.specialty}
                    </div>
                    {lastMsg && (
                      <div style={{
                        fontSize: '0.78rem', color: 'var(--text-muted)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {lastMsg.text.substring(0, 40)}{lastMsg.text.length > 40 ? '...' : ''}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: doc.isAvailable ? 'var(--success)' : 'var(--text-muted)',
                      flexShrink: 0,
                    }} />
                    {lastMsg && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{formatTime(lastMsg.timestamp)}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ----- MAIN CHAT PANE ----- */}
        <div style={{ background: 'var(--card-bg)', display: 'flex', flexDirection: 'column' }}>
          {activeDoctor ? (
            <>
              {/* Chat header */}
              <div style={{
                padding: '1rem', borderBottom: '1px solid var(--border-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 700, fontSize: '0.85rem',
                  }}>
                    {activeDoctor.initials}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>{activeDoctor.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{activeDoctor.specialty}</span>
                  </div>
                </div>
                <button className="btn-secondary btn-sm" onClick={() => openBookingForDoctor(activeDoctor.id)}>
                  📅 Book
                </button>
              </div>

              {/* Messages */}
              <div style={{
                flex: 1, overflowY: 'auto', padding: '1.25rem',
                display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'var(--bg)',
              }}>
                {!activeConv?.messages?.length && (
                  <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem', opacity: 0.4 }}>💬</div>
                    <p>Send a message to start your consultation.</p>
                  </div>
                )}
                {activeConv?.messages?.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      maxWidth: '72%',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.925rem',
                      lineHeight: 1.55,
                      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      background: msg.sender === 'user'
                        ? 'linear-gradient(135deg, var(--primary), #3a7bc8)'
                        : 'var(--card-bg)',
                      color: msg.sender === 'user' ? '#fff' : 'var(--text)',
                      borderBottomRightRadius: msg.sender === 'user' ? 'var(--radius-xs)' : 'var(--radius-md)',
                      borderBottomLeftRadius: msg.sender === 'doctor' ? 'var(--radius-xs)' : 'var(--radius-md)',
                      boxShadow: 'var(--shadow-xs)',
                      animation: 'pageEnter 0.3s ease-out',
                    }}
                  >
                    {msg.text}
                    <div style={{
                      fontSize: '0.65rem', marginTop: '0.3rem',
                      color: msg.sender === 'user' ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)',
                    }}>
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isAITyping && (
                  <div style={{
                    alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.5rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem',
                  }}>
                    <span>Doctor is typing</span>
                    <span style={{ display: 'flex', gap: '4px' }}>
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          style={{
                            width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)',
                            animation: `typingBounce 1.4s ease-in-out infinite`,
                            animationDelay: `${i * 0.2}s`,
                          }}
                        />
                      ))}
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div style={{
                padding: '0.75rem 1.25rem', borderTop: '1px solid var(--border-light)',
                display: 'flex', gap: '0.75rem',
              }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  maxLength={500}
                  style={{
                    flex: 1, padding: '0.7rem 1rem',
                    border: '2px solid var(--border)', borderRadius: 'var(--radius-full)',
                    fontSize: '0.925rem', fontFamily: 'var(--sans)', outline: 'none',
                    transition: 'border-color var(--transition-fast)',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--primary-glow)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
                <button
                  onClick={handleSend}
                  disabled={!draft.trim() || isAITyping}
                  style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px var(--primary-glow)',
                    opacity: (!draft.trim() || isAITyping) ? 0.5 : 1,
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  ➤
                </button>
              </div>
            </>
          ) : (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              height: '100%', color: 'var(--text-muted)', gap: '0.75rem',
            }}>
              <div style={{ fontSize: '4rem', opacity: 0.5 }}>💬</div>
              <h3>Your Messages</h3>
              <p>Select a doctor from the list to start chatting.</p>
              <button className="btn-primary btn-sm" onClick={() => navigate('/doctors')}>Find a Doctor</button>
            </div>
          )}
        </div>
      </div>

      {/* Inline keyframe for typing dots (not injected globally on purpose) */}
      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-7px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
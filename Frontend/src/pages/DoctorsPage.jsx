import { useNavigate } from 'react-router-dom';
import { useMedical } from '../context/MedicalContext';

function Stars({ rating }) {
  const full = Math.round(rating);
  return (
    <span style={{ color: '#F59E0B', letterSpacing: '1px', fontSize: '0.85rem' }}>
      {'★'.repeat(full)}{'☆'.repeat(5 - full)}
      <span style={{ color: 'var(--text)', marginLeft: '0.3rem' }}>{rating.toFixed(1)}</span>
    </span>
  );
}

export default function DoctorsPage() {
  const navigate = useNavigate();
  const { doctors, startConversation, openBookingForDoctor } = useMedical();

  return (
    <div className="content-page">
      <div className="doctors-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <h1>👨‍⚕️ Doctors Directory</h1>
        <button className="btn-primary btn-sm" onClick={() => navigate('/quiz')}>🔍 Match Me Quiz</button>
      </div>

      <div className="doctors-grid">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            className="form-card"
            style={{
              display: 'flex',
              gap: '1rem',
              padding: '1.5rem',
              cursor: 'default',
              transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 16px 40px rgba(74,144,226,0.14)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <div style={{
              width: 60, height: 60, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 800, fontSize: '1.2rem', flexShrink: 0,
            }}>
              {doc.initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ marginBottom: '0.2rem', fontSize: '1.1rem' }}>{doc.name}</h3>
              <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                {doc.specialty}
              </div>
              <p style={{
                fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.6rem',
                display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {doc.bio}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                <Stars rating={doc.rating} />
                {doc.isAvailable ? (
                  <span style={{
                    fontSize: '0.78rem', fontWeight: 600, padding: '0.2rem 0.6rem',
                    background: 'var(--success-bg)', color: 'var(--success)', borderRadius: 'var(--radius-full)',
                  }}>
                    ● Available
                  </span>
                ) : (
                  <span style={{
                    fontSize: '0.78rem', fontWeight: 600, padding: '0.2rem 0.6rem',
                    background: 'var(--error-bg)', color: 'var(--error)', borderRadius: 'var(--radius-full)',
                  }}>
                    ● Unavailable
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn-primary btn-sm"
                  onClick={() => {
                    startConversation(doc.id);
                    navigate('/messages');
                  }}
                >
                  💬 Chat
                </button>
                <button className="btn-secondary btn-sm" onClick={() => openBookingForDoctor(doc.id)}>
                  📅 Book
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useMedical } from '../context/MedicalContext';
import { getDoctorById } from '../data/doctors';

const TIME_SLOTS = [
  '09:00 AM – 10:00 AM',
  '10:00 AM – 11:00 AM',
  '11:00 AM – 12:00 PM',
  '12:00 PM – 01:00 PM',
  '01:00 PM – 02:00 PM',
  '02:00 PM – 03:00 PM',
  '03:00 PM – 04:00 PM',
  '04:00 PM – 05:00 PM',
];

function fireConfetti() {
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;inset:0;z-index:9999;pointer-events:none;';
  document.body.appendChild(container);

  const colors = [
    '#4A90E2', '#50C878', '#7BC6FF', '#6EE7B7', '#F59E0B',
    '#EF4444', '#8B5CF6', '#EC4899', '#22C55E', '#EAB308',
    '#F97316', '#06B6D4',
  ];

  const frag = document.createDocumentFragment();
  for (let i = 0; i < 40; i++) {
    const el = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const dur = 2 + Math.random() * 3;
    const delay = Math.random() * 1.5;
    const spin = 360 + Math.random() * 1080;
    const w = 6 + Math.random() * 8;
    const h = 4 + Math.random() * 8;
    el.style.cssText = `
      position:absolute;top:-20px;left:${left}%;
      width:${w}px;height:${h}px;background:${color};
      border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
      animation: confettiFall ${dur}s ease-out ${delay}s forwards;
    `;
    el.style.setProperty('--spin', `${spin}deg`);
    frag.appendChild(el);
  }
  container.appendChild(frag);

  // Inject keyframes if not already present
  if (!document.getElementById('confetti-keyframes')) {
    const style = document.createElement('style');
    style.id = 'confetti-keyframes';
    style.textContent = `
      @keyframes confettiFall {
        0%   { transform: translateY(-100px) rotate(0deg) scale(1); opacity:1; }
        100% { transform: translateY(110vh) rotate(var(--spin, 720deg)) scale(0.3); opacity:0; }
      }
    `;
    document.head.appendChild(style);
  }

  setTimeout(() => container.remove(), 5000);
}

export default function BookingModal() {
  const { showBookingModal, closeBookingModal, bookingDoctorId, addBooking } = useMedical();
  const doctor = getDoctorById(bookingDoctorId);

  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [consultType, setConsultType] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!showBookingModal) {
      setDate(''); setTimeSlot(''); setConsultType(''); setNotes('');
      setErrors([]); setSubmitted(false); setShowConfirm(false);
    }
  }, [showBookingModal]);

  if (!showBookingModal || !doctor) return null;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = [];
    if (!date) errs.push('Please select a date.');
    if (!timeSlot) errs.push('Please select a time slot.');
    if (!consultType) errs.push('Please select a consultation type.');
    setErrors(errs);
    if (errs.length > 0) return;

    const booking = {
      id: `booking-${Date.now()}`,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      date,
      timeSlot: TIME_SLOTS[parseInt(timeSlot)],
      type: consultType,
      notes: notes.trim(),
      bookedAt: Date.now(),
      status: 'confirmed',
    };

    addBooking(booking);
    setSubmitted(true);
    setShowConfirm(true);
    fireConfetti();
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const typeLabel = (t) => {
    switch (t) {
      case 'chat': return '💬 Chat';
      case 'voice': return '📞 Voice';
      case 'video': return '📹 Video';
      default: return t;
    }
  };

  // ---- Confirmation overlay ----
  if (showConfirm) {
    return (
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 3000,
          background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        onClick={() => { setShowConfirm(false); closeBookingModal(); }}
      >
        <div
          style={{
            background: 'var(--card-bg)', borderRadius: 'var(--radius-2xl)',
            padding: '3rem 2.5rem', textAlign: 'center', maxWidth: '420px', width: '90%',
            boxShadow: 'var(--shadow-xl)',
            animation: 'scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Animated checkmark */}
          <div style={{ width: 72, height: 72, margin: '0 auto' }}>
            <svg width="72" height="72" viewBox="0 0 52 52">
              <circle
                cx="26" cy="26" r="25" fill="none" stroke="var(--secondary)" strokeWidth="3"
                strokeDasharray="157" strokeDashoffset="157"
                style={{ animation: 'drawCircle 0.6s ease-out forwards' }}
              />
              <path
                fill="none" stroke="var(--secondary)" strokeWidth="3"
                strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray="48" strokeDashoffset="48"
                d="M14 27l7 7 16-16"
                style={{ animation: 'drawCheck 0.4s 0.5s ease-out forwards' }}
              />
            </svg>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '1.25rem 0 0.5rem', color: 'var(--text-h)' }}>
            Booking Confirmed!
          </h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>
            Your consultation with <strong>{doctor.name}</strong> is scheduled for{' '}
            <strong>{formatDate(date)}</strong> at <strong>{TIME_SLOTS[parseInt(timeSlot)]}</strong>{' '}
            via <strong>{typeLabel(consultType)}</strong>.
          </p>
          <button
            className="btn-primary"
            onClick={() => { setShowConfirm(false); closeBookingModal(); }}
          >
            Done
          </button>
        </div>
        <style>{`
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes drawCircle { to { stroke-dashoffset: 0; } }
          @keyframes drawCheck { to { stroke-dashoffset: 0; } }
        `}</style>
      </div>
    );
  }

  // ---- Booking form modal ----
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={closeBookingModal}
    >
      <div
        style={{
          background: 'var(--card-bg)', borderRadius: 'var(--radius-xl)',
          padding: '2rem', width: '100%', maxWidth: '520px', maxHeight: '90vh',
          overflowY: 'auto', boxShadow: 'var(--shadow-xl)',
          animation: 'pageEnter 0.3s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', margin: 0 }}>📅 Book Consultation</h2>
          <button
            onClick={closeBookingModal}
            style={{
              background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer',
              color: 'var(--text-muted)', lineHeight: 1, padding: '0.25rem',
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Doctor</label>
            <input type="text" value={`${doctor.name} — ${doctor.specialty}`} readOnly />
          </div>

          <div className="form-group">
            <label>Preferred Date</label>
            <input
              type="date"
              value={date}
              min={minDate}
              onChange={(e) => setDate(e.target.value)}
              required
              className={errors.includes('Please select a date.') ? 'error' : ''}
            />
          </div>

          <div className="form-group">
            <label>Time Slot</label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              required
              className={errors.includes('Please select a time slot.') ? 'error' : ''}
            >
              <option value="">Select a time slot</option>
              {TIME_SLOTS.map((slot, i) => (
                <option key={i} value={i}>{slot}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Consultation Type</label>
            <select
              value={consultType}
              onChange={(e) => setConsultType(e.target.value)}
              required
              className={errors.includes('Please select a consultation type.') ? 'error' : ''}
            >
              <option value="">Select type</option>
              <option value="chat">💬 Chat</option>
              <option value="voice">📞 Voice</option>
              <option value="video">📹 Video</option>
            </select>
          </div>

          <div className="form-group">
            <label>Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Briefly describe what you'd like to discuss..."
              maxLength={300}
              rows={3}
            />
          </div>

          {errors.length > 0 && (
            <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
              {errors.map((e, i) => <div key={i}>⚠️ {e}</div>)}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn-primary btn-full">Confirm Booking</button>
            <button type="button" className="btn-secondary" onClick={closeBookingModal}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
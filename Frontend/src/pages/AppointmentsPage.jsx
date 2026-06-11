import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useMedical } from '../context/MedicalContext';
import { useAuth } from '../context/AuthContext';
import { appointmentAPI } from '../api';

// Status badge component
function StatusBadge({ status }) {
  const statusStyles = {
    Pending: { bg: 'var(--warning-bg)', color: 'var(--warning)', border: 'var(--warning-border)' },
    Confirmed: { bg: 'var(--success-bg)', color: 'var(--success)', border: 'var(--success-border)' },
    Completed: { bg: 'var(--primary-light)', color: 'var(--primary)', border: 'var(--accent-blue)' },
    Cancelled: { bg: 'var(--error-bg)', color: 'var(--error)', border: 'var(--error-border)' },
  };

  const s = statusStyles[status] || statusStyles.Pending;

  return (
    <span style={{
      fontSize: '0.78rem', fontWeight: 600, padding: '0.2rem 0.65rem',
      background: s.bg, color: s.color, borderRadius: 'var(--radius-full)',
      border: `1px solid ${s.border}`,
    }}>
      {status}
    </span>
  );
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr + (dateStr.includes('T') ? '' : 'T00:00:00'));
    return d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function AppointmentsPage() {
  const { bookings, addBooking } = useMedical();
  const { user, isAuthenticated } = useAuth();
  const [apiAppointments, setApiAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelConfirmId, setCancelConfirmId] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'history'

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (isAuthenticated) {
        const res = await appointmentAPI.getAppointments();
        setApiAppointments(res.data);
      }
    } catch (err) {
      // Fallback silently - local bookings still work
      console.log('API fetch failed, using local bookings');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Merge API appointments with local bookings
  const allAppointments = [
    ...apiAppointments.map(apt => ({
      id: apt.id,
      doctorId: apt.doctor_id,
      doctorName: apt.doctor_name,
      doctorSpecialty: '',
      patientName: apt.patient_name,
      patientEmail: apt.patient_email,
      patientPhone: apt.patient_phone,
      date: apt.appointment_date,
      timeSlot: apt.appointment_time,
      reason: apt.reason,
      notes: apt.notes,
      status: apt.status,
      bookedAt: apt.created_at,
      isApi: true,
    })),
    ...bookings.map(b => ({
      id: b.id,
      doctorId: b.doctorId,
      doctorName: b.doctorName,
      doctorSpecialty: b.doctorSpecialty || '',
      patientName: b.patientName || '',
      patientEmail: b.patientEmail || '',
      patientPhone: b.patientPhone || '',
      date: b.date,
      timeSlot: b.timeSlot,
      reason: b.reason || b.type || '',
      notes: b.notes || '',
      status: b.status || 'Confirmed',
      bookedAt: b.bookedAt,
      isApi: false,
    })),
  ];

  // Deduplicate by ID
  const seen = new Set();
  const uniqueAppointments = allAppointments.filter(a => {
    if (seen.has(a.id)) return false;
    seen.add(a.id);
    return true;
  });

  // Sort by date
  uniqueAppointments.sort((a, b) => new Date(b.date) - new Date(a.date));

  const upcoming = uniqueAppointments.filter(a => a.status === 'Pending' || a.status === 'Confirmed');
  const history = uniqueAppointments.filter(a => a.status === 'Completed' || a.status === 'Cancelled');

  const displayedAppointments = activeTab === 'upcoming' ? upcoming : history;

  const handleCancelClick = (id) => {
    setCancelConfirmId(id);
  };

  const handleCancelConfirm = async () => {
    if (!cancelConfirmId) return;
    setCancelling(true);
    try {
      const appointment = uniqueAppointments.find(a => a.id === cancelConfirmId);
      if (appointment && appointment.isApi) {
        await appointmentAPI.cancelAppointment(cancelConfirmId);
        await fetchAppointments();
      } else {
        // Update local booking status
        const updated = bookings.map(b =>
          b.id === cancelConfirmId ? { ...b, status: 'Cancelled' } : b
        );
        localStorage.setItem('ehealth_bookings', JSON.stringify(updated));
        window.dispatchEvent(new Event('bookingsUpdated'));
        // Force re-render
        window.location.reload();
      }
    } catch (err) {
      setError('Failed to cancel appointment. Please try again.');
    } finally {
      setCancelling(false);
      setCancelConfirmId(null);
    }
  };

  const handleCancelDismiss = () => {
    setCancelConfirmId(null);
  };

  return (
    <div className="content-page">
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1>📅 My Appointments</h1>
        <p>Manage your scheduled appointments and view your history.</p>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          className={activeTab === 'upcoming' ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming ({upcoming.length})
        </button>
        <button
          className={activeTab === 'history' ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}
          onClick={() => setActiveTab('history')}
        >
          History ({history.length})
        </button>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="page-loading">
          <div className="spinner"></div>
          <p>Loading appointments...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && displayedAppointments.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <h3>{activeTab === 'upcoming' ? 'No Upcoming Appointments' : 'No Appointment History'}</h3>
          <p>
            {activeTab === 'upcoming'
              ? 'You have no upcoming appointments. Book an appointment with one of our specialists.'
              : 'Your completed and cancelled appointments will appear here.'}
          </p>
          {activeTab === 'upcoming' && (
            <Link to="/doctors" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
              Browse Doctors
            </Link>
          )}
        </div>
      )}

      {/* Appointment Cards */}
      {!loading && displayedAppointments.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {displayedAppointments.map((apt) => (
            <div
              key={apt.id}
              className="form-card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                animation: 'fadeIn 0.35s ease-out, slideUp 0.35s ease-out',
                transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(74,144,226,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                    <h3 style={{ fontSize: '1.15rem', margin: 0, color: 'var(--text-h)' }}>
                      {apt.doctorName}
                    </h3>
                    <StatusBadge status={apt.status} />
                  </div>
                  {apt.doctorSpecialty && (
                    <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                      {apt.doctorSpecialty}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                    <span>
                      <strong>Date:</strong> {formatDisplayDate(apt.date)}
                    </span>
                    <span>
                      <strong>Time:</strong> {apt.timeSlot || '—'}
                    </span>
                  </div>
                  {apt.reason && (
                    <div style={{ marginTop: '0.5rem', color: 'var(--text)', fontSize: '0.9rem' }}>
                      <strong>Reason:</strong> {apt.reason}
                    </div>
                  )}
                  {apt.notes && (
                    <div style={{ marginTop: '0.25rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                      Notes: {apt.notes}
                    </div>
                  )}
                  {apt.patientName && (
                    <div style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      Patient: {apt.patientName} | {apt.patientPhone || 'N/A'}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              {(apt.status === 'Pending' || apt.status === 'Confirmed') && (
                <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-light)' }}>
                  <button
                    className="btn-secondary btn-sm"
                    onClick={() => handleCancelClick(apt.id)}
                    style={{ color: 'var(--error)', borderColor: 'var(--error-border)' }}
                  >
                    Cancel Appointment
                  </button>
                </div>
              )}
              {apt.status === 'Cancelled' && (
                <div style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  This appointment was cancelled.
                </div>
              )}
              {apt.status === 'Completed' && (
                <div style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border-light)', color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600 }}>
                  ✓ Completed
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {cancelConfirmId && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={handleCancelDismiss}
        >
          <div
            style={{
              background: 'var(--card-bg)', borderRadius: 'var(--radius-xl)',
              padding: '2rem', maxWidth: '420px', width: '90%',
              boxShadow: 'var(--shadow-xl)', textAlign: 'center',
              animation: 'scaleIn 0.3s ease-out',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h3 style={{ color: 'var(--text-h)', marginBottom: '0.75rem' }}>Cancel Appointment?</h3>
            <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                className="btn-secondary"
                onClick={handleCancelDismiss}
                disabled={cancelling}
              >
                Keep Appointment
              </button>
              <button
                className="btn-primary"
                onClick={handleCancelConfirm}
                disabled={cancelling}
                style={{ background: 'var(--error)', boxShadow: '0 4px 16px rgba(239,68,68,0.25)' }}
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
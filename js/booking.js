/**
 * E-Health Mental Wellness Platform
 * booking.js — Consultation Booking System
 *
 * Features:
 * - Modal overlay with booking form
 * - Doctor Name (read-only), Date Picker (min: tomorrow), Time Slot dropdown (8 slots, 09:00-18:00)
 * - Consultation Type (Chat, Voice, Video), Notes textarea
 * - Persists bookings to ehealth_bookings in localStorage
 * - Full-screen confirmation overlay with checkmark pop animation
 * - Celebratory confetti explosion (40 distinct falling particles)
 */

import { getDoctorById } from './doctors.js';
import { sanitize } from './security.js';

/** localStorage key for bookings */
const BOOKINGS_STORAGE_KEY = 'ehealth_bookings';

/** Available time slots */
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

/**
 * Opens the booking modal for a specific doctor.
 * @param {string} doctorId - The doctor's ID.
 * @param {Object} store - The centralized store.
 */
export function openBookingModal(doctorId, store) {
  const doctor = getDoctorById(doctorId);
  if (!doctor) {
    alert('Doctor not found.');
    return;
  }

  const state = store.getState();
  const modal = document.getElementById('booking-modal');
  const panel = document.getElementById('booking-panel');

  if (!modal || !panel) return;

  // Get tomorrow's date in YYYY-MM-DD format
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const timeOptions = TIME_SLOTS.map((slot, index) => `
    <option value="${index}">${slot}</option>
  `).join('');

  panel.innerHTML = `
    <div class="modal-header">
      <h2>📅 Book Consultation</h2>
      <button class="modal-close" id="modal-close-btn" aria-label="Close">&times;</button>
    </div>
    <form id="booking-form" novalidate>
      <div class="form-group">
        <label for="booking-doctor">Doctor</label>
        <input type="text" id="booking-doctor" value="${sanitize(doctor.name)} — ${sanitize(doctor.specialty)}" readonly />
      </div>
      <div class="form-group">
        <label for="booking-date">Preferred Date</label>
        <input type="date" id="booking-date" min="${minDate}" required />
      </div>
      <div class="form-group">
        <label for="booking-time">Time Slot</label>
        <select id="booking-time" required>
          <option value="">Select a time slot</option>
          ${timeOptions}
        </select>
      </div>
      <div class="form-group">
        <label for="booking-type">Consultation Type</label>
        <select id="booking-type" required>
          <option value="">Select type</option>
          <option value="chat">💬 Chat</option>
          <option value="voice">📞 Voice</option>
          <option value="video">📹 Video</option>
        </select>
      </div>
      <div class="form-group">
        <label for="booking-notes">Notes (optional)</label>
        <textarea id="booking-notes" placeholder="Briefly describe what you'd like to discuss..." maxlength="300"></textarea>
      </div>
      <div id="booking-error" class="alert alert-error hidden"></div>
      <div style="display:flex;gap:1rem;margin-top:0.5rem;">
        <button type="submit" class="btn-primary btn-full">Confirm Booking</button>
        <button type="button" class="btn-secondary" id="booking-cancel-btn">Cancel</button>
      </div>
    </form>
  `;

  modal.removeAttribute('hidden');

  // Close button
  document.getElementById('modal-close-btn').addEventListener('click', () => closeBookingModal());
  document.getElementById('booking-cancel-btn').addEventListener('click', () => closeBookingModal());

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeBookingModal();
  });

  // Form submission
  document.getElementById('booking-form').addEventListener('submit', (e) => {
    e.preventDefault();
    handleBookingSubmit(doctorId, doctor, store);
  });
}

/**
 * Closes the booking modal.
 */
function closeBookingModal() {
  const modal = document.getElementById('booking-modal');
  if (modal) {
    modal.setAttribute('hidden', '');
  }
}

/**
 * Handles the booking form submission with validation.
 * @param {string} doctorId
 * @param {Object} doctor
 * @param {Object} store
 */
function handleBookingSubmit(doctorId, doctor, store) {
  const dateInput = document.getElementById('booking-date');
  const timeSelect = document.getElementById('booking-time');
  const typeSelect = document.getElementById('booking-type');
  const notesInput = document.getElementById('booking-notes');
  const errorDiv = document.getElementById('booking-error');

  // Clear previous errors
  errorDiv.classList.add('hidden');
  [dateInput, timeSelect, typeSelect].forEach(el => el.classList.remove('error'));

  // Validate
  let errors = [];
  if (!dateInput.value) {
    errors.push('Please select a preferred date.');
    dateInput.classList.add('error');
  }
  if (!timeSelect.value) {
    errors.push('Please select a time slot.');
    timeSelect.classList.add('error');
  }
  if (!typeSelect.value) {
    errors.push('Please select a consultation type.');
    typeSelect.classList.add('error');
  }

  if (errors.length > 0) {
    errorDiv.innerHTML = '⚠️ ' + errors.join('<br>');
    errorDiv.classList.remove('hidden');
    errorDiv.classList.add('shake');
    setTimeout(() => errorDiv.classList.remove('shake'), 500);
    return;
  }

  // Build booking object
  const booking = {
    id: `booking-${Date.now()}`,
    doctorId: doctorId,
    doctorName: doctor.name,
    doctorSpecialty: doctor.specialty,
    date: dateInput.value,
    timeSlot: TIME_SLOTS[parseInt(timeSelect.value)],
    type: typeSelect.value,
    notes: sanitize(notesInput.value.trim()),
    bookedAt: Date.now(),
    status: 'confirmed',
  };

  // Save to localStorage
  saveBooking(booking);

  // Update store
  const state = store.getState();
  const updatedBookings = [...state.bookings, booking];
  store.setState({ bookings: updatedBookings });

  // Close modal
  closeBookingModal();

  // Show confirmation overlay
  showConfirmation(booking);

  // Fire confetti
  fireConfetti();
}

/**
 * Saves a booking to localStorage under ehealth_bookings.
 * @param {Object} booking
 */
function saveBooking(booking) {
  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    const bookings = raw ? JSON.parse(raw) : [];
    bookings.push(booking);
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
  } catch (err) {
    console.error('[Booking] Failed to save booking:', err);
  }
}

/**
 * Retrieves all bookings from localStorage.
 * @returns {Array}
 */
export function getBookings() {
  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Shows the full-screen confirmation overlay with checkmark animation.
 * @param {Object} booking
 */
function showConfirmation(booking) {
  const overlay = document.getElementById('confirm-overlay');
  const msg = document.getElementById('confirm-msg');

  if (!overlay || !msg) return;

  msg.innerHTML = `
    Your consultation with <strong>${sanitize(booking.doctorName)}</strong> is scheduled for<br>
    <strong>${formatDate(booking.date)}</strong> at <strong>${sanitize(booking.timeSlot)}</strong>
    via <strong>${getTypeLabel(booking.type)}</strong>.
  `;

  overlay.removeAttribute('hidden');

  // Close button
  document.getElementById('confirm-close').addEventListener('click', () => {
    overlay.setAttribute('hidden', '');
  }, { once: true });

  // Auto-close after 8 seconds
  setTimeout(() => {
    if (!overlay.hasAttribute('hidden')) {
      overlay.setAttribute('hidden', '');
    }
  }, 8000);
}

/**
 * Fires a celebratory confetti explosion with 40 distinct particles.
 */
export function fireConfetti() {
  const container = document.getElementById('confetti-container');
  if (!container) return;

  const colors = [
    '#4A90E2', '#50C878', '#7BC6FF', '#6EE7B7', '#F59E0B',
    '#EF4444', '#8B5CF6', '#EC4899', '#22C55E', '#EAB308',
    '#F97316', '#06B6D4',
  ];

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < 40; i++) {
    const particle = document.createElement('div');
    particle.classList.add('confetti-particle');

    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100; // percentage
    const fallDur = 2 + Math.random() * 3; // 2-5 seconds
    const fallDelay = Math.random() * 1.5; // 0-1.5 seconds
    const spin = 360 + Math.random() * 1080; // 360-1440 degrees
    const width = 6 + Math.random() * 8; // 6-14px
    const height = 4 + Math.random() * 8; // 4-12px

    particle.style.cssText = `
      background: ${color};
      left: ${left}%;
      width: ${width}px;
      height: ${height}px;
      --fall-dur: ${fallDur}s;
      --fall-delay: ${fallDelay}s;
      --spin: ${spin}deg;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
    `;

    fragment.appendChild(particle);
  }

  container.appendChild(fragment);

  // Clean up particles after all animations complete
  const maxDuration = 5000; // 5 seconds max
  setTimeout(() => {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }, maxDuration);
}

/**
 * Formats a YYYY-MM-DD date string into a readable format.
 * @param {string} dateStr
 * @returns {string}
 */
function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Gets a human-readable label for a consultation type.
 * @param {string} type
 * @returns {string}
 */
function getTypeLabel(type) {
  switch (type) {
    case 'chat': return '💬 Chat';
    case 'voice': return '📞 Voice';
    case 'video': return '📹 Video';
    default: return type;
  }
}

export default {
  openBookingModal,
  getBookings,
  fireConfetti,
};
import { createContext, useContext, useState, useCallback } from 'react';
import { getAllDoctors, getDoctorById, getTopMatches } from '../data/doctors';

const MedicalContext = createContext(null);

const BOOKINGS_KEY = 'ehealth_bookings';

function loadBookings() {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function MedicalProvider({ children }) {
  const [activeChatDoctorId, setActiveChatDoctorId] = useState(null);
  const [conversations, setConversations] = useState({});
  const [bookings, setBookings] = useState(loadBookings);
  const [isAITyping, setIsAITyping] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [bookingDoctorId, setBookingDoctorId] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const doctors = getAllDoctors();

  const addBooking = useCallback((booking) => {
    const updated = [...loadBookings(), booking];
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
    setBookings(updated);
  }, []);

  const startConversation = useCallback((doctorId) => {
    setConversations((prev) => {
      if (prev[doctorId]) return prev;
      const doctor = getDoctorById(doctorId);
      if (!doctor) return prev;
      return {
        ...prev,
        [doctorId]: {
          doctorId,
          messages: [
            {
              sender: 'doctor',
              text: `Hello! I'm ${doctor.name}, ${doctor.specialty}. How can I help you today? Feel free to describe your symptoms or ask any health-related questions.`,
              timestamp: Date.now(),
            },
          ],
        },
      };
    });
    setActiveChatDoctorId(doctorId);
  }, []);

  const addMessage = useCallback((doctorId, message) => {
    setConversations((prev) => {
      const conv = prev[doctorId] || { doctorId, messages: [] };
      return {
        ...prev,
        [doctorId]: {
          ...conv,
          messages: [...conv.messages, message],
        },
      };
    });
  }, []);

  /** Open booking modal for a given doctor */
  const openBookingForDoctor = useCallback((doctorId) => {
    setBookingDoctorId(doctorId);
    setShowBookingModal(true);
  }, []);

  const closeBookingModal = useCallback(() => {
    setShowBookingModal(false);
    setBookingDoctorId(null);
  }, []);

  const resetQuiz = useCallback(() => {
    setQuizAnswers([]);
    setQuizStep(0);
    setQuizCompleted(false);
  }, []);

  const value = {
    doctors,
    activeChatDoctorId,
    setActiveChatDoctorId,
    conversations,
    setConversations,
    bookings,
    setBookings,
    isAITyping,
    setIsAITyping,
    quizAnswers,
    setQuizAnswers,
    quizCompleted,
    setQuizCompleted,
    quizStep,
    setQuizStep,
    bookingDoctorId,
    showBookingModal,
    openBookingForDoctor,
    closeBookingModal,
    addBooking,
    startConversation,
    addMessage,
    resetQuiz,
    getDoctorById,
    getTopMatches,
  };

  return (
    <MedicalContext.Provider value={value}>
      {children}
    </MedicalContext.Provider>
  );
}

export function useMedical() {
  const ctx = useContext(MedicalContext);
  if (!ctx) {
    throw new Error('useMedical must be used within a MedicalProvider');
  }
  return ctx;
}

export default MedicalContext;
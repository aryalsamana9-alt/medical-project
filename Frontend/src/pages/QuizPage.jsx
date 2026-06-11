import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMedical } from '../context/MedicalContext';

const QUESTIONS = [
  {
    id: 'symptoms',
    question: 'What symptoms are you experiencing?',
    type: 'multi',
    options: [
      { label: 'Headache / Migraine', keywords: ['headache', 'migraine', 'pain'] },
      { label: 'Chest discomfort / Palpitations', keywords: ['chest pain', 'palpitations', 'heart'] },
      { label: 'Joint or muscle pain', keywords: ['joint', 'bone', 'pain', 'knee', 'shoulder', 'arthritis', 'back pain'] },
      { label: 'Stomach / Digestive issues', keywords: ['stomach', 'abdominal', 'digestive', 'nausea', 'bloating', 'diarrhea'] },
      { label: 'Skin rash / Irritation', keywords: ['skin', 'rash', 'itching', 'acne', 'eczema'] },
      { label: 'Anxiety / Depression / Mood changes', keywords: ['anxiety', 'depression', 'stress', 'mental health', 'mood', 'panic'] },
      { label: 'Breathing difficulty / Cough', keywords: ['breathing', 'cough', 'asthma', 'lung', 'wheezing'] },
      { label: 'Fatigue / Weakness / Weight changes', keywords: ['fatigue', 'weight', 'tired', 'thyroid', 'diabetes', 'hormone'] },
      { label: 'Dizziness / Numbness / Tingling', keywords: ['dizziness', 'numbness', 'tingling', 'vertigo', 'nerve'] },
      { label: "Women's health / Menstrual issues", keywords: ['menstrual', 'period', 'pelvic pain', 'pregnancy', 'menopause'] },
      { label: 'Child health / Pediatric concerns', keywords: ['child', 'children', 'baby', 'infant', 'pediatric', 'fever'] },
      { label: 'Sleep problems', keywords: ['insomnia', 'sleep apnea', 'sleep'] },
    ],
  },
  {
    id: 'severity',
    question: 'How would you rate the severity of your symptoms?',
    type: 'single',
    options: [
      { label: 'Mild — Noticeable but not interfering', keywords: ['mild'] },
      { label: 'Moderate — Somewhat interfering', keywords: ['moderate'] },
      { label: 'Severe — Significantly impacting', keywords: ['severe'] },
      { label: 'Very Severe — Unable to function', keywords: ['emergency', 'severe'] },
    ],
  },
  {
    id: 'duration',
    question: 'How long have you been experiencing these symptoms?',
    type: 'single',
    options: [
      { label: 'Less than 1 week', keywords: [] },
      { label: '1–4 weeks', keywords: [] },
      { label: '1–6 months', keywords: ['chronic'] },
      { label: 'More than 6 months', keywords: ['chronic'] },
    ],
  },
  {
    id: 'concern',
    question: 'What area concerns you most?',
    type: 'single',
    options: [
      { label: 'Physical pain or discomfort', keywords: ['pain', 'surgery', 'orthopedic'] },
      { label: 'Emotional or mental well-being', keywords: ['anxiety', 'depression', 'mental health', 'psychiatry', 'therapy'] },
      { label: 'Heart or cardiovascular health', keywords: ['heart', 'cardiac', 'blood pressure', 'hypertension'] },
      { label: 'Skin or appearance', keywords: ['skin', 'dermatology', 'rash'] },
      { label: 'Digestive or stomach issues', keywords: ['stomach', 'digestive', 'IBS', 'GERD'] },
      { label: 'Nervous system (headaches, numbness)', keywords: ['neurology', 'headache', 'migraine', 'numbness', 'nerve'] },
      { label: 'Hormonal or metabolic issues', keywords: ['hormone', 'thyroid', 'diabetes', 'endocrine'] },
      { label: 'Cancer screening or concerns', keywords: ['cancer', 'tumor', 'screening', 'oncology'] },
    ],
  },
];

function Stars({ rating }) {
  const full = Math.round(rating);
  return (
    <span className="stars" style={{ color: '#F59E0B', letterSpacing: '1px' }}>
      {'★'.repeat(full)}{'☆'.repeat(5 - full)} <span style={{ color: 'var(--text)', fontSize: '0.85rem' }}>{rating.toFixed(1)}</span>
    </span>
  );
}

export default function QuizPage() {
  const navigate = useNavigate();
  const {
    quizStep, setQuizStep, quizAnswers, setQuizAnswers,
    quizCompleted, setQuizCompleted, getTopMatches, startConversation,
    openBookingForDoctor, resetQuiz,
  } = useMedical();

  const [currentSelections, setCurrentSelections] = useState([]);
  const [showResults, setShowResults] = useState(quizCompleted);

  // Re-initialize currentSelections from existing answers on mount/step change
  useState(() => {
    const existing = quizAnswers.filter((a) => a.step === quizStep).map((a) => a.optionIndex);
    setCurrentSelections(existing);
  }, [quizStep]);

  if (showResults && quizAnswers.length > 0) {
    const allKeywords = quizAnswers.flatMap((a) => a.keywords || []);
    const unique = [...new Set(allKeywords)];
    const matches = getTopMatches(unique, 3);

    return (
      <div className="content-page">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎉</div>
          <h1>Your Matches Are Ready!</h1>
          <p className="text-muted">Based on your symptoms, here are the best-fitting specialists.</p>
        </div>

        {matches.length === 0 ? (
          <div className="form-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏥</div>
            <h2>No Strong Match Found</h2>
            <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>
              We couldn't determine a specific specialist match based on your responses.
              We recommend starting with a general consultation.
            </p>
            <button className="btn-primary" onClick={() => navigate('/doctors')}>Browse All Doctors</button>
          </div>
        ) : (
          matches.map((match, idx) => {
            const doc = match.doctor;
            const isTop = idx === 0;
            return (
              <div
                key={doc.id}
                className="form-card"
                style={{
                  marginBottom: '1rem',
                  border: isTop ? '2px solid var(--primary)' : '1px solid var(--border)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div
                    style={{
                      width: 64, height: 64, borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: 800, fontSize: '1.3rem', flexShrink: 0,
                    }}
                  >
                    {doc.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ marginBottom: '0.2rem' }}>
                      {doc.name}
                      {isTop && (
                        <span style={{
                          fontSize: '0.7rem', background: 'var(--primary)', color: '#fff',
                          padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-xs)', marginLeft: '0.5rem',
                        }}>
                          Best Match
                        </span>
                      )}
                    </h3>
                    <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                      {doc.specialty}
                    </div>
                    <Stars rating={doc.rating} />
                  </div>
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{
                      fontSize: '2rem', fontWeight: 900,
                      background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>
                      {match.score}%
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Match</div>
                  </div>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginTop: '0.75rem' }}>{doc.bio}</p>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                  <button
                    className="btn-primary btn-sm"
                    onClick={() => {
                      startConversation(doc.id);
                      navigate('/messages');
                    }}
                  >
                    💬 Chat Now
                  </button>
                  <button
                    className="btn-secondary btn-sm"
                    onClick={() => {
                      openBookingForDoctor(doc.id);
                    }}
                  >
                    📅 Book Consultation
                  </button>
                </div>
              </div>
            );
          })
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button
            className="btn-secondary"
            onClick={() => {
              resetQuiz();
              setShowResults(false);
              setCurrentSelections([]);
            }}
          >
            🔄 Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  // ----- Quiz Step UI -----
  const totalSteps = QUESTIONS.length;
  const question = QUESTIONS[quizStep];
  const isMulti = question.type === 'multi';
  const hasSelection = currentSelections.length > 0;
  const progressPct = Math.round((quizStep / totalSteps) * 100);

  const toggleOption = (index) => {
    if (isMulti) {
      setCurrentSelections((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setCurrentSelections([index]);
    }
  };

  const goNext = () => {
    // Save selections
    const newAnswers = quizAnswers.filter((a) => a.step !== quizStep);
    for (const idx of currentSelections) {
      const opt = question.options[idx];
      newAnswers.push({ step: quizStep, questionId: question.id, optionIndex: idx, keywords: opt.keywords });
    }
    setQuizAnswers(newAnswers);

    if (quizStep + 1 >= totalSteps) {
      setQuizCompleted(true);
      setShowResults(true);
    } else {
      setQuizStep(quizStep + 1);
      setCurrentSelections([]);
    }
  };

  const goBack = () => {
    if (quizStep > 0) {
      setQuizStep(quizStep - 1);
      const prevAnswers = quizAnswers.filter((a) => a.step === quizStep - 1).map((a) => a.optionIndex);
      setCurrentSelections(prevAnswers);
    }
  };

  return (
    <div className="content-page" style={{ maxWidth: '650px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>🔍 Match Me Quiz</h1>
        <p style={{ color: 'var(--text-muted)' }}>Answer a few questions and we'll match you with the right specialist.</p>
      </div>

      {/* Progress bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          Step {quizStep + 1} of {totalSteps}
        </span>
        <div style={{ flex: 1, height: 6, background: 'var(--border-light)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            borderRadius: 3,
            width: `${progressPct}%`,
            transition: 'width var(--transition)',
          }} />
        </div>
      </div>

      {/* Question card */}
      <div className="form-card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: isMulti ? '0.5rem' : '1.25rem' }}>{question.question}</h2>
        {isMulti && (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Select all that apply
          </p>
        )}
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {question.options.map((opt, idx) => {
            const selected = currentSelections.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => toggleOption(idx)}
                style={{
                  padding: '1rem 1.25rem',
                  background: selected ? 'var(--primary-light)' : 'var(--card-bg)',
                  border: selected ? '2px solid var(--primary)' : '2px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--sans)',
                  textAlign: 'left',
                  transition: 'all var(--transition-fast)',
                  color: 'var(--text)',
                  boxShadow: selected ? '0 0 0 3px var(--primary-glow)' : 'none',
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          {quizStep > 0 && (
            <button className="btn-secondary" onClick={goBack}>← Back</button>
          )}
        </div>
        <button className="btn-primary" disabled={!hasSelection} onClick={goNext}>
          {quizStep < totalSteps - 1 ? 'Next →' : 'See My Matches ✨'}
        </button>
      </div>
    </div>
  );
}
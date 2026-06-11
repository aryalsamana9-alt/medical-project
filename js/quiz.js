/**
 * E-Health Mental Wellness Platform
 * quiz.js — Patient Intake "Match Me" Quiz Component
 *
 * Features:
 * - Dynamic multi-step symptom quiz with smooth transitions
 * - Collects user responses and calculates match scores against doctors
 * - 2x keyword weight modifier for doctor specialty matching
 * - Result card showing top matches with match percentage
 * - "Chat Now" button to instantly initiate conversation with matched doctor
 */

import { doctors, getTopMatches, getDoctorById } from './doctors.js';
import { sanitize } from './security.js';

/** Quiz questions definition */
const QUIZ_QUESTIONS = [
  {
    id: 'symptoms',
    question: 'What symptoms are you experiencing?',
    type: 'multi-select',
    options: [
      { label: 'Headache / Migraine', keywords: ['headache', 'migraine', 'pain', 'head'] },
      { label: 'Chest discomfort / Palpitations', keywords: ['chest pain', 'palpitations', 'heart', 'breathing'] },
      { label: 'Joint or muscle pain', keywords: ['joint', 'bone', 'pain', 'knee', 'shoulder', 'hip', 'back pain', 'arthritis'] },
      { label: 'Stomach / Digestive issues', keywords: ['stomach', 'abdominal', 'digestive', 'nausea', 'bloating', 'diarrhea', 'constipation', 'heartburn'] },
      { label: 'Skin rash / Irritation', keywords: ['skin', 'rash', 'itching', 'acne', 'eczema', 'mole'] },
      { label: 'Anxiety / Depression / Mood changes', keywords: ['anxiety', 'depression', 'stress', 'mental health', 'mood', 'sadness', 'worry', 'panic'] },
      { label: 'Breathing difficulty / Cough', keywords: ['breathing', 'cough', 'asthma', 'lung', 'wheezing', 'shortness of breath'] },
      { label: 'Fatigue / Weakness / Weight changes', keywords: ['fatigue', 'weight', 'tired', 'thyroid', 'diabetes', 'hormone'] },
      { label: 'Dizziness / Numbness / Tingling', keywords: ['dizziness', 'numbness', 'tingling', 'vertigo', 'balance', 'nerve'] },
      { label: 'Women\'s health / Menstrual issues', keywords: ['menstrual', 'period', 'pelvic pain', 'pregnancy', 'menopause', 'women'] },
      { label: 'Child health / Pediatric concerns', keywords: ['child', 'children', 'baby', 'infant', 'pediatric', 'fever', 'vaccination'] },
      { label: 'Sleep problems', keywords: ['insomnia', 'sleep apnea', 'sleep', 'CPAP'] },
    ],
  },
  {
    id: 'severity',
    question: 'How would you rate the severity of your symptoms?',
    type: 'single-select',
    options: [
      { label: '🟢 Mild — Noticeable but not interfering with daily life', keywords: ['mild'] },
      { label: '🟡 Moderate — Somewhat interfering with daily activities', keywords: ['moderate'] },
      { label: '🟠 Severe — Significantly impacting daily life', keywords: ['severe'] },
      { label: '🔴 Very Severe — Unable to perform normal activities', keywords: ['emergency', 'urgent', 'severe'] },
    ],
  },
  {
    id: 'duration',
    question: 'How long have you been experiencing these symptoms?',
    type: 'single-select',
    options: [
      { label: 'Less than 1 week', keywords: ['acute'] },
      { label: '1–4 weeks', keywords: ['subacute'] },
      { label: '1–6 months', keywords: ['chronic'] },
      { label: 'More than 6 months', keywords: ['chronic', 'long-term'] },
    ],
  },
  {
    id: 'concern',
    question: 'What area concerns you most?',
    type: 'single-select',
    options: [
      { label: 'Physical pain or discomfort', keywords: ['pain', 'surgery', 'orthopedic', 'injury'] },
      { label: 'Emotional or mental well-being', keywords: ['anxiety', 'depression', 'mental health', 'psychiatry', 'stress', 'therapy'] },
      { label: 'Heart or cardiovascular health', keywords: ['heart', 'cardiac', 'blood pressure', 'hypertension', 'cholesterol'] },
      { label: 'Skin or appearance', keywords: ['skin', 'dermatology', 'rash', 'acne'] },
      { label: 'Digestive or stomach issues', keywords: ['stomach', 'digestive', 'IBS', 'GERD', 'gut'] },
      { label: 'Nervous system (headaches, numbness)', keywords: ['neurology', 'headache', 'migraine', 'numbness', 'nerve'] },
      { label: 'Hormonal or metabolic issues', keywords: ['hormone', 'thyroid', 'diabetes', 'endocrine', 'metabolism'] },
      { label: 'Cancer screening or concerns', keywords: ['cancer', 'tumor', 'screening', 'oncology', 'lump'] },
    ],
  },
  {
    id: 'age_group',
    question: 'What age group does the patient belong to?',
    type: 'single-select',
    options: [
      { label: '👶 Infant / Toddler (0–3 years)', keywords: ['child', 'baby', 'infant', 'pediatric'] },
      { label: '👧 Child (4–12 years)', keywords: ['child', 'children', 'pediatric', 'school'] },
      { label: '🧑 Teen / Young Adult (13–25 years)', keywords: ['teen', 'adolescent'] },
      { label: '👨 Adult (26–60 years)', keywords: [] },
      { label: '👴 Senior (60+ years)', keywords: ['dementia', 'Alzheimer', 'osteoporosis', 'arthritis'] },
    ],
  },
];

/**
 * Renders the quiz view and manages the full quiz flow.
 * @param {Object} store - The centralized store.
 * @param {Function} navigateTo - Router navigateTo function.
 * @param {Function} startConversation - Function to start a chat with a doctor.
 * @returns {string} HTML string for the quiz view.
 */
export function renderQuizView(store, navigateTo, startConversation) {
  const state = store.getState();

  // If quiz already completed, show results directly
  if (state.quizCompleted && state.quizAnswers.length > 0) {
    return renderQuizResults(state.quizAnswers, store, navigateTo, startConversation);
  }

  const currentStep = state.quizStep || 0;
  const totalSteps = QUIZ_QUESTIONS.length;
  const question = QUIZ_QUESTIONS[currentStep];
  const answers = state.quizAnswers || [];

  // Selected options for the current step
  const selectedForStep = answers.filter(a => a.step === currentStep).map(a => a.optionIndex);

  const progressPercent = Math.round(((currentStep) / totalSteps) * 100);

  const optionsHTML = question.options.map((opt, index) => {
    const isSelected = selectedForStep.includes(index);
    return `
      <button
        class="quiz-option ${isSelected ? 'selected' : ''}"
        data-option-index="${index}"
        data-step="${currentStep}"
      >
        ${sanitize(opt.label)}
      </button>
    `;
  }).join('');

  const isMulti = question.type === 'multi-select';
  const hasSelection = selectedForStep.length > 0;

  return `
    <div class="page-view quiz-container">
      <div style="margin-bottom:1.5rem;">
        <h1 style="margin-bottom:0.5rem;">🔍 Match Me Quiz</h1>
        <p style="color:var(--text-muted);">Answer a few questions and we'll match you with the right specialist.</p>
      </div>

      <div class="quiz-progress">
        <span style="font-size:0.85rem;color:var(--text-muted);">Step ${currentStep + 1} of ${totalSteps}</span>
        <div class="quiz-progress-bar">
          <div class="quiz-progress-fill" style="width:${progressPercent}%;"></div>
        </div>
      </div>

      <div class="quiz-question card" id="quiz-question-card">
        <h2>${sanitize(question.question)}</h2>
        ${isMulti ? '<p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:1rem;">Select all that apply</p>' : ''}
        <div class="quiz-options" id="quiz-options">
          ${optionsHTML}
        </div>
      </div>

      <div class="quiz-nav">
        ${currentStep > 0 ? `
          <button class="btn-secondary" id="quiz-prev-btn">← Back</button>
        ` : '<div></div>'}
        <button
          class="btn-primary"
          id="quiz-next-btn"
          ${!hasSelection ? 'disabled' : ''}
        >
          ${currentStep < totalSteps - 1 ? 'Next →' : 'See My Matches ✨'}
        </button>
      </div>
    </div>
  `;
}

/**
 * Initializes quiz event listeners after the quiz view is rendered.
 * @param {Object} store - The centralized store.
 * @param {Function} navigateTo - Router navigateTo function.
 * @param {Function} startConversation - Function to start a chat.
 */
export function initQuizListeners(store, navigateTo, startConversation) {
  const state = store.getState();

  // If already completed, init result listeners
  if (state.quizCompleted) {
    initResultListeners(store, navigateTo, startConversation);
    return;
  }

  const currentStep = state.quizStep || 0;
  const question = QUIZ_QUESTIONS[currentStep];
  const answers = state.quizAnswers || [];

  // Track selections for current step
  let stepSelections = answers.filter(a => a.step === currentStep).map(a => a.optionIndex);

  // Option click handlers
  const options = document.querySelectorAll('.quiz-option');
  options.forEach(option => {
    option.addEventListener('click', () => {
      const index = parseInt(option.getAttribute('data-option-index'));
      const step = parseInt(option.getAttribute('data-step'));

      if (question.type === 'single-select') {
        // Deselect all, select clicked
        options.forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        stepSelections = [index];
      } else {
        // Toggle selection
        if (stepSelections.includes(index)) {
          stepSelections = stepSelections.filter(i => i !== index);
          option.classList.remove('selected');
        } else {
          stepSelections.push(index);
          option.classList.add('selected');
        }
      }

      // Enable/disable next button
      const nextBtn = document.getElementById('quiz-next-btn');
      if (nextBtn) {
        nextBtn.disabled = stepSelections.length === 0;
      }
    });
  });

  // Next button
  const nextBtn = document.getElementById('quiz-next-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToStep(currentStep, stepSelections, store, navigateTo, startConversation);
    });
  }

  // Previous button
  const prevBtn = document.getElementById('quiz-prev-btn');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const newStep = Math.max(0, currentStep - 1);
      store.setState({
        quizStep: newStep,
        quizAnswers: answers.filter(a => a.step !== currentStep),
      });
      navigateTo('#/quiz');
    });
  }
}

/**
 * Advances the quiz to the next step or shows results.
 */
function goToStep(currentStep, stepSelections, store, navigateTo, startConversation) {
  const answers = [...(store.getState().quizAnswers || [])];
  const question = QUIZ_QUESTIONS[currentStep];

  // Remove old answers for this step
  const filtered = answers.filter(a => a.step !== currentStep);

  // Add new selections
  for (const index of stepSelections) {
    const option = question.options[index];
    filtered.push({
      step: currentStep,
      questionId: question.id,
      optionIndex: index,
      keywords: option.keywords,
    });
  }

  const totalSteps = QUIZ_QUESTIONS.length;
  const nextStep = currentStep + 1;

  if (nextStep >= totalSteps) {
    // Quiz complete — calculate results
    store.setState({
      quizAnswers: filtered,
      quizStep: totalSteps,
      quizCompleted: true,
    });
    navigateTo('#/quiz');
  } else {
    store.setState({
      quizAnswers: filtered,
      quizStep: nextStep,
    });
    navigateTo('#/quiz');
  }
}

/**
 * Renders quiz results with top doctor matches.
 */
function renderQuizResults(answers, store, navigateTo, startConversation) {
  // Collect all keywords from user's answers
  const allKeywords = [];
  for (const answer of answers) {
    if (answer.keywords && answer.keywords.length > 0) {
      allKeywords.push(...answer.keywords);
    }
  }

  // Deduplicate
  const uniqueKeywords = [...new Set(allKeywords)];

  // Get top matches
  const matches = getTopMatches(uniqueKeywords, 3);

  if (matches.length === 0) {
    return `
      <div class="page-view quiz-container">
        <div class="card quiz-result-card">
          <div style="font-size:4rem;margin-bottom:1rem;">🏥</div>
          <h2>No Strong Match Found</h2>
          <p style="color:var(--text-light);margin-bottom:1.5rem;">
            We couldn't determine a specific specialist match based on your responses.
            We recommend starting with a general consultation.
          </p>
          <a href="#/doctors" class="btn-primary">Browse All Doctors</a>
        </div>
      </div>
    `;
  }

  // Store matched doctor IDs for result card actions
  window._quizMatches = matches;

  const matchCardsHTML = matches.map((match, index) => {
    const doctor = match.doctor;
    const isTop = index === 0;
    return `
      <div class="card ${isTop ? 'card-hoverable' : ''}" style="margin-bottom:1rem;${isTop ? 'border:2px solid var(--primary);' : ''}">
        <div style="display:flex;align-items:center;gap:1rem;">
          <div class="doctor-avatar-lg" style="width:64px;height:64px;font-size:1.3rem;">
            ${sanitize(doctor.initials)}
          </div>
          <div style="flex:1;min-width:0;">
            <h3 style="margin-bottom:0.2rem;">
              ${sanitize(doctor.name)}
              ${isTop ? '<span style="font-size:0.75rem;background:var(--primary);color:white;padding:0.15rem 0.5rem;border-radius:var(--radius-xs);margin-left:0.5rem;">Best Match</span>' : ''}
            </h3>
            <div class="doctor-specialty">${sanitize(doctor.specialty)}</div>
            <div class="stars">${'★'.repeat(Math.round(doctor.rating))}${'☆'.repeat(5 - Math.round(doctor.rating))} ${doctor.rating.toFixed(1)}</div>
          </div>
          <div style="text-align:center;flex-shrink:0;">
            <div class="match-percentage" style="font-size:2.2rem;">${match.score}%</div>
            <div class="match-label">Match</div>
          </div>
        </div>
        <p style="font-size:0.9rem;color:var(--text-light);margin-top:0.75rem;">${sanitize(doctor.bio)}</p>
        <div style="display:flex;gap:0.75rem;margin-top:1rem;">
          <button class="btn-primary btn-sm" onclick="window._quizStartChat('${doctor.id}')">
            💬 Chat Now
          </button>
          <button class="btn-secondary btn-sm" onclick="window._bookWithDoctor('${doctor.id}')">
            📅 Book Consultation
          </button>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="page-view quiz-container">
      <div style="text-align:center;margin-bottom:2rem;">
        <div style="font-size:3rem;margin-bottom:0.5rem;">🎉</div>
        <h1>Your Matches Are Ready!</h1>
        <p style="color:var(--text-muted);">Based on your symptoms, here are the best-fitting specialists.</p>
      </div>
      ${matchCardsHTML}
      <div style="text-align:center;margin-top:1.5rem;">
        <button class="btn-secondary" id="quiz-retake-btn">🔄 Retake Quiz</button>
        <a href="#/doctors" class="btn-secondary" style="margin-left:0.75rem;">👨‍⚕️ View All Doctors</a>
      </div>
    </div>
  `;
}

/**
 * Initializes event listeners for the quiz results view.
 */
function initResultListeners(store, navigateTo, startConversation) {
  // Retake button
  const retakeBtn = document.getElementById('quiz-retake-btn');
  if (retakeBtn) {
    retakeBtn.addEventListener('click', () => {
      store.setState({
        quizAnswers: [],
        quizStep: 0,
        quizCompleted: false,
      });
      navigateTo('#/quiz');
    });
  }
}

/**
 * Resets the quiz state.
 * @param {Object} store
 */
export function resetQuiz(store) {
  store.setState({
    quizAnswers: [],
    quizStep: 0,
    quizCompleted: false,
  });
}

export default {
  renderQuizView,
  initQuizListeners,
  resetQuiz,
};
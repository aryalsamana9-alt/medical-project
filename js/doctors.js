/**
 * E-Health Mental Wellness Platform
 * doctors.js — 12 Medical/Mental Health Specialist Profiles
 *
 * Each profile includes:
 * - Name, specialty, initials, bio
 * - Star rating (1-5) and availability flag
 * - Specialty keywords for matching
 * - 8+ professional, discipline-specific replies
 */

export const doctors = [
  {
    id: 'doctor-1',
    name: 'Dr. Robert Mitchell',
    specialty: 'General Surgery',
    initials: 'RM',
    bio: 'Board-certified general surgeon with over 20 years of experience in minimally invasive surgical techniques and post-operative care.',
    rating: 4.8,
    availability: true,
    keywords: [
      'surgery', 'surgical', 'operation', 'appendicitis', 'gallbladder', 'hernia',
      'laparoscopic', 'incision', 'biopsy', 'tumor', 'thyroid', 'wound',
      'post-op', 'recovery', 'stitches', 'scar', 'abdominal', 'general',
    ],
    replies: [
      "Based on your description, I would recommend scheduling a consultation to evaluate whether surgical intervention is necessary. Many conditions can be managed conservatively before considering surgery.",
      "Post-operative recovery varies by procedure, but typically you should avoid heavy lifting for 4-6 weeks. I'd like to review your specific case to give you a more precise timeline.",
      "Minimally invasive laparoscopic surgery often results in shorter recovery times and less scarring compared to traditional open surgery. Let's discuss if you're a candidate.",
      "That symptom could indicate a condition requiring surgical evaluation. I recommend keeping a symptom diary and scheduling an in-person examination soon.",
      "Before any surgical procedure, we'll conduct a comprehensive pre-operative assessment including blood work and imaging to ensure your safety.",
      "Wound care is critical for proper healing. Keep the area clean and dry, watch for signs of infection like redness or discharge, and follow up if anything concerns you.",
      "I understand surgery can feel overwhelming. We'll walk through every step of the process together, and I'm here to answer all your questions.",
      "Gallbladder issues can often be managed with dietary changes initially, but if symptoms persist or worsen, laparoscopic cholecystectomy has excellent outcomes.",
      "Hernias don't heal on their own and may require surgical repair to prevent complications. Let me evaluate the severity before we decide on the best approach.",
      "Biopsy results typically take 3-7 days to process. I know the waiting period is difficult — we'll review the results together as soon as they're available.",
    ],
  },
  {
    id: 'doctor-2',
    name: 'Dr. Karen Patel',
    specialty: 'Orthopedic Surgery',
    initials: 'KP',
    bio: 'Fellowship-trained orthopedic surgeon specializing in sports medicine, joint replacement, and arthroscopic procedures for knee and shoulder injuries.',
    rating: 4.9,
    availability: true,
    keywords: [
      'bone', 'joint', 'knee', 'shoulder', 'hip', 'fracture', 'sprain',
      'ligament', 'ACL', 'cartilage', 'arthritis', 'back pain', 'spine',
      'sports injury', 'dislocation', 'tendon', 'physical therapy', 'orthopedic',
      'mobility', 'stiffness', 'swelling', 'runner', 'athlete',
    ],
    replies: [
      "That type of joint pain could be from overuse, arthritis, or a soft tissue injury. I'd like to see you for a physical examination and possibly imaging to confirm.",
      "ACL tears may require surgical reconstruction depending on your activity level and the degree of instability. Let's review your MRI results together.",
      "Physical therapy is the cornerstone of orthopedic recovery. I'll work with your PT to design a protocol tailored to your specific injury and goals.",
      "Joint replacement surgery has advanced significantly — many patients walk the same day and return home within 24 hours. Let me assess if you're a good candidate.",
      "RICE protocol (Rest, Ice, Compression, Elevation) is your best first step for that acute injury. If swelling persists beyond 48 hours, come see me.",
      "Chronic back pain can have many sources — disc issues, muscular strain, or structural problems. A thorough evaluation will help us identify the root cause.",
      "That clicking or popping sensation in your knee could be a meniscus tear. While some heal with conservative care, others benefit from arthroscopic repair.",
      "Returning to sports after injury requires a graduated protocol. Rushing back too soon risks re-injury — let's set realistic milestones together.",
      "Arthritis doesn't mean the end of activity. With proper joint preservation strategies, many patients maintain excellent mobility and quality of life.",
      "I recommend low-impact activities like swimming or cycling during recovery to maintain cardiovascular fitness while protecting your healing joint.",
    ],
  },
  {
    id: 'doctor-3',
    name: 'Dr. Elena Vasquez',
    specialty: 'Neurology',
    initials: 'EV',
    bio: 'Double board-certified neurologist with expertise in headache medicine, epilepsy management, and neurodegenerative disorders including Alzheimer\'s and Parkinson\'s disease.',
    rating: 4.7,
    availability: true,
    keywords: [
      'headache', 'migraine', 'seizure', 'epilepsy', 'tremor', 'Parkinson',
      'Alzheimer', 'memory', 'dementia', 'numbness', 'tingling', 'dizziness',
      'vertigo', 'stroke', 'neurology', 'nerve', 'brain', 'concussion',
      'neuropathy', 'MS', 'multiple sclerosis', 'confusion', 'balance',
    ],
    replies: [
      "Migraines can have numerous triggers including stress, diet, sleep patterns, and environmental factors. Let's identify your specific triggers and develop a prevention plan.",
      "That pattern of numbness and tingling warrants a neurological examination. We may need nerve conduction studies to determine if there's peripheral nerve involvement.",
      "Memory changes can be concerning, but many causes are reversible — including vitamin deficiencies, sleep disorders, and medication side effects. Let's rule those out first.",
      "For epilepsy management, medication compliance is critical. If you're experiencing breakthrough seizures, we may need to adjust your dosage or explore alternative medications.",
      "Dizziness and vertigo can stem from inner ear issues, neurological conditions, or cardiovascular problems. A detailed history will help narrow the differential diagnosis.",
      "Parkinson's disease management has come a long way. With medication and targeted therapies, many patients maintain independence and quality of life for years.",
      "Concussion recovery requires both physical and cognitive rest. Avoid screens, bright lights, and intense concentration for at least 24-48 hours after injury.",
      "Stroke warning signs include sudden numbness, confusion, trouble speaking, or vision changes. If you experience these, seek emergency care immediately — time is brain.",
      "Neuropathy pain responds well to a combination of medication, physical therapy, and lifestyle modifications. We'll create a multimodal treatment approach for you.",
      "The tingling you describe could be related to a pinched nerve, vitamin B12 deficiency, or an early sign of neuropathy. Blood work and an EMG can help clarify.",
    ],
  },
  {
    id: 'doctor-4',
    name: 'Dr. Marcus Chen',
    specialty: 'Psychiatry',
    initials: 'MC',
    bio: 'Compassionate psychiatrist focused on depression, anxiety disorders, PTSD, and bipolar disorder. Integrates medication management with cognitive behavioral therapy principles.',
    rating: 4.9,
    availability: true,
    keywords: [
      'depression', 'anxiety', 'panic', 'PTSD', 'trauma', 'bipolar', 'mood',
      'stress', 'therapy', 'mental health', 'insomnia', 'OCD', 'ADHD',
      'phobia', 'grief', 'suicidal', 'self-harm', 'counseling', 'psychiatry',
      'antidepressant', 'medication', 'sadness', 'worry', 'fear', 'overwhelmed',
      'hopeless', 'lonely', 'isolation',
    ],
    replies: [
      "I hear you, and I want you to know that what you're feeling is valid. Depression is a medical condition, not a personal failing, and treatment is very effective.",
      "Anxiety can feel overwhelming, but grounding techniques can help in the moment. Try the 5-4-3-2-1 technique: name 5 things you see, 4 you feel, 3 you hear, 2 you smell, and 1 you taste.",
      "PTSD treatment has excellent outcomes with evidence-based approaches like EMDR and trauma-focused CBT. You don't have to carry this burden alone.",
      "Medication can be an important tool, but it works best in combination with therapy. Let's discuss both medication options and therapeutic approaches that might suit you.",
      "Sleep disturbances often accompany mood disorders. Let's work on sleep hygiene practices while we address the underlying condition.",
      "If you're having thoughts of harming yourself, please reach out to a crisis line immediately. You matter, and there are people ready to help you right now.",
      "Bipolar disorder requires consistent management, but many people live full, productive lives with the right combination of mood stabilizers and lifestyle strategies.",
      "Grief isn't linear, and there's no timeline for healing. What you're experiencing is a normal response to loss. Support groups can be incredibly helpful during this time.",
      "Panic attacks feel terrifying but they're not dangerous. The symptoms peak around 10 minutes and then subside. Breathing exercises can help shorten the episode.",
      "It takes courage to seek help. I'm glad you reached out. Let's start by understanding what brings you here today and what you hope to achieve through treatment.",
      "ADHD in adults often goes undiagnosed because the symptoms manifest differently than in children. Difficulty with organization, time management, and focus are common signs.",
    ],
  },
  {
    id: 'doctor-5',
    name: 'Dr. Sarah Owusu',
    specialty: 'Cardiology',
    initials: 'SO',
    bio: 'Interventional cardiologist specializing in preventive cardiology, heart failure management, and cardiac rehabilitation. Passionate about heart-healthy lifestyle interventions.',
    rating: 4.8,
    availability: true,
    keywords: [
      'heart', 'chest pain', 'palpitations', 'arrhythmia', 'blood pressure',
      'hypertension', 'cholesterol', 'ECG', 'echocardiogram', 'cardiac',
      'heart attack', 'angina', 'shortness of breath', 'cardiovascular',
      'stroke', 'circulation', 'edema', 'pacemaker', 'bypass', 'stent',
      'dizziness', 'fainting', 'fatigue',
    ],
    replies: [
      "That chest discomfort warrants immediate evaluation. While it may not be cardiac, we should rule out any heart-related causes without delay — please schedule an urgent appointment.",
      "Blood pressure management is a marathon, not a sprint. Consistent monitoring, medication adherence, and lifestyle changes like sodium reduction all play crucial roles.",
      "High cholesterol has no symptoms until it causes problems. That's why we call it a silent condition. The good news is it's highly manageable with diet, exercise, and medication if needed.",
      "Palpitations are often benign but can sometimes signal an arrhythmia. I'd like to do an ECG and possibly a Holter monitor to capture your heart's rhythm over 24-48 hours.",
      "Cardiac rehabilitation after a heart event is absolutely essential. Our program includes supervised exercise, education, and support to get you back to living fully.",
      "The Mediterranean diet has the strongest evidence for heart health — rich in olive oil, fish, vegetables, and whole grains. Even small changes can make significant differences.",
      "Shortness of breath could be a sign of heart failure, but also lung conditions or anemia. We'll run tests including an echocardiogram and BNP levels to investigate.",
      "Quitting smoking is the single most impactful thing you can do for your heart health. Within just 24 hours, your heart attack risk begins to drop. Let me connect you with resources.",
      "Regular aerobic exercise — even 30 minutes of brisk walking five days a week — can lower blood pressure, improve cholesterol, and reduce heart attack risk significantly.",
      "Edema in the legs can indicate fluid retention related to heart function. I'd like to assess your heart's pumping efficiency with an echocardiogram.",
    ],
  },
  {
    id: 'doctor-6',
    name: 'Dr. James Nakamura',
    specialty: 'Pediatrics',
    initials: 'JN',
    bio: 'Board-certified pediatrician specializing in child development, asthma management, and adolescent medicine. Believes in family-centered, compassionate care for every child.',
    rating: 4.9,
    availability: true,
    keywords: [
      'child', 'children', 'baby', 'infant', 'pediatric', 'vaccination',
      'immunization', 'growth', 'development', 'ADHD', 'autism', 'asthma',
      'allergies', 'fever', 'rash', 'eczema', 'colic', 'breastfeeding',
      'nutrition', 'teen', 'adolescent', 'school', 'cough', 'ear infection',
    ],
    replies: [
      "Fevers in children can be alarming but are usually the body's natural defense against infection. For infants under 3 months, however, any fever requires immediate evaluation.",
      "Vaccination is one of the safest and most effective ways to protect your child from serious diseases. I'm happy to discuss any concerns you have about the immunization schedule.",
      "Developmental milestones vary widely, and every child progresses at their own pace. If you're noticing delays, early intervention services can make a tremendous difference.",
      "Asthma in children requires a multi-pronged approach: identifying triggers, proper inhaler technique, and having an action plan for school and activities.",
      "Breastfeeding challenges are common but most can be overcome with the right support. I'd like to connect you with our lactation consultant for specialized guidance.",
      "That rash could be eczema, a contact allergy, or a viral exanthem. Keep the skin moisturized and avoid harsh soaps. If it persists or worsens, bring them in for evaluation.",
      "ADHD affects children differently — some struggle with focus, others with impulsivity. A comprehensive evaluation helps us understand your child's unique needs and strengths.",
      "Nutrition during the first 1000 days of life shapes lifelong health. Focus on introducing a variety of whole foods and letting your child follow their hunger and fullness cues.",
      "Ear infections are common in young children due to their developing anatomy. Most resolve without antibiotics, but persistent cases may warrant evaluation for ear tubes.",
      "Adolescent mental health is just as important as physical health. Creating an open, non-judgmental space for your teen to talk makes all the difference.",
    ],
  },
  {
    id: 'doctor-7',
    name: 'Dr. Priya Srinivasan',
    specialty: 'Dermatology',
    initials: 'PS',
    bio: 'Board-certified dermatologist with expertise in medical dermatology, skin cancer screening, psoriasis treatment, and cosmetic dermatology. Advocate for sun safety and skin health education.',
    rating: 4.7,
    availability: true,
    keywords: [
      'skin', 'rash', 'acne', 'eczema', 'psoriasis', 'dermatitis', 'mole',
      'melanoma', 'skin cancer', 'sunburn', 'sunscreen', 'rosacea', 'hives',
      'itching', 'lesion', 'cyst', 'dermatology', 'hair loss', 'nail',
      'dandruff', 'wrinkle', 'hyperpigmentation',
    ],
    replies: [
      "Any changing mole should be evaluated promptly using the ABCDE rule: Asymmetry, Border irregularity, Color variation, Diameter over 6mm, and Evolution over time.",
      "Acne management requires patience and consistency. A good skincare routine with gentle cleansing, non-comedogenic moisturizer, and prescribed topicals forms the foundation.",
      "Psoriasis is an autoimmune condition, not contagious. While there's no cure, modern biologics can achieve remarkable clearance for many patients.",
      "Daily sunscreen (SPF 30+ broad spectrum) is your best defense against premature aging and skin cancer — even on cloudy days and when indoors near windows.",
      "That persistent itch could be eczema, contact dermatitis, or an allergic reaction. Avoid scratching, use fragrance-free moisturizers, and let's identify the trigger together.",
      "Hair loss has many causes including genetics, stress, hormonal changes, and nutritional deficiencies. Blood work and a scalp examination will help narrow the diagnosis.",
      "Rosacea triggers vary by person — common ones include sun exposure, spicy foods, alcohol, and stress. Keeping a trigger diary can help you identify and avoid flare-ups.",
      "Skin cancer is highly treatable when caught early. I recommend annual full-body skin checks, especially if you have a family history or extensive sun exposure.",
      "Hyperpigmentation takes time to fade — usually 3-6 months with consistent treatment. Sun protection is non-negotiable during this process to prevent darkening.",
      "Eczema management centers on moisturizing the skin barrier and avoiding irritants. Bathing in lukewarm water and applying thick cream within 3 minutes of toweling off helps lock in moisture.",
    ],
  },
  {
    id: 'doctor-8',
    name: 'Dr. Rachel Goldstein',
    specialty: 'Obstetrics & Gynecology',
    initials: 'RG',
    bio: 'Compassionate OB/GYN providing comprehensive women\'s health care including prenatal care, family planning, and minimally invasive gynecologic surgery.',
    rating: 4.8,
    availability: true,
    keywords: [
      'pregnancy', 'prenatal', 'gynecology', 'menstrual', 'period', 'cramps',
      'pelvic pain', 'endometriosis', 'PCOS', 'menopause', 'fertility',
      'contraception', 'birth control', 'pap smear', 'women', 'OBGYN',
      'UTI', 'hormones', 'bleeding', 'discharge',
    ],
    replies: [
      "During pregnancy, prenatal vitamins with folic acid are essential for fetal development. I recommend starting them even before conception if you're planning to become pregnant.",
      "Period pain that interferes with daily life is NOT normal and shouldn't be dismissed. Conditions like endometriosis affect 1 in 10 women and can be effectively managed.",
      "PCOS management involves a holistic approach — lifestyle modifications, possible medication, and addressing insulin resistance. You have many treatment options available.",
      "Menopause is a natural transition, not a medical problem. However, symptoms like hot flashes and sleep disruption can be managed with both hormonal and non-hormonal options.",
      "Annual well-woman exams including Pap smears are crucial for early detection of cervical abnormalities. Most cervical cancers are preventable with regular screening.",
      "Contraception choices are highly personal. Let's discuss your lifestyle, health history, and future family plans to find the method that works best for you.",
      "Pelvic pain has many potential causes — ovarian cysts, fibroids, endometriosis, or pelvic inflammatory disease. A transvaginal ultrasound can provide valuable diagnostic information.",
      "Abnormal bleeding should always be evaluated. While often benign (like fibroids or hormonal fluctuations), we need to rule out more serious causes including endometrial changes.",
      "Fertility naturally declines with age, but many factors influence your chances of conception. A fertility assessment can provide clarity about your reproductive timeline.",
      "UTI symptoms like burning and frequency should be treated promptly to prevent the infection from ascending to the kidneys. Increasing water intake and cranberry supplements may help prevent recurrence.",
    ],
  },
  {
    id: 'doctor-9',
    name: 'Dr. David Okonkwo',
    specialty: 'Oncology',
    initials: 'DO',
    bio: 'Medical oncologist specializing in breast cancer, lung cancer, and hematologic malignancies. Dedicated to providing cutting-edge treatments including immunotherapy and targeted therapy.',
    rating: 4.9,
    availability: false,
    keywords: [
      'cancer', 'tumor', 'chemotherapy', 'radiation', 'oncology', 'lump',
      'breast cancer', 'lung cancer', 'leukemia', 'lymphoma', 'melanoma',
      'biopsy', 'remission', 'immunotherapy', 'screening', 'mammogram',
      'colonoscopy', 'PET scan', 'fatigue', 'weight loss', 'night sweats',
      'blood count', 'anemia',
    ],
    replies: [
      "A cancer diagnosis feels overwhelming, but treatment options have expanded dramatically. Immunotherapy, targeted therapy, and personalized medicine are transforming outcomes.",
      "Unexplained weight loss, fatigue, and night sweats are symptoms that warrant investigation. While often benign, these 'B symptoms' can sometimes indicate lymphoma.",
      "Mammogram screenings save lives. We recommend annual mammograms starting at age 40 for average-risk women, and earlier if you have a family history of breast cancer.",
      "Chemotherapy side effects are much more manageable today than even a decade ago. We have excellent medications for nausea, and many patients continue working through treatment.",
      "Not all tumors are cancerous — benign growths far outnumber malignant ones. A biopsy is the only definitive way to determine if cells are cancerous.",
      "Colonoscopy is the gold standard for colorectal cancer screening. The prep may be inconvenient, but finding and removing precancerous polyps during the procedure prevents cancer.",
      "After treatment ends, survivorship care focuses on monitoring for recurrence, managing long-term side effects, and promoting overall wellness.",
      "Clinical trials offer access to promising new treatments. I'll let you know if there are any trials that might be appropriate for your specific situation.",
      "Genetic testing can identify inherited cancer risk, which helps guide screening and prevention strategies for you and your family members.",
      "Anemia can be caused by cancer itself or by treatments. Iron supplementation, dietary changes, or in some cases, blood transfusions can help restore your energy levels.",
    ],
  },
  {
    id: 'doctor-10',
    name: 'Dr. Lisa Tremblay',
    specialty: 'Pulmonology',
    initials: 'LT',
    bio: 'Pulmonary disease specialist focusing on asthma, COPD, interstitial lung disease, and sleep-disordered breathing. Expert in pulmonary function testing and bronchoscopy.',
    rating: 4.6,
    availability: true,
    keywords: [
      'lung', 'breathing', 'cough', 'asthma', 'COPD', 'bronchitis', 'pneumonia',
      'shortness of breath', 'wheezing', 'oxygen', 'sleep apnea', 'CPAP',
      'pulmonary', 'respiratory', 'smoking', 'inhaler', 'allergy',
      'chest', 'sputum', 'congestion',
    ],
    replies: [
      "Shortness of breath that persists beyond normal exertion should be evaluated with pulmonary function tests. These non-invasive tests measure how well your lungs are working.",
      "Asthma control is about more than just rescue inhalers. An effective long-term control strategy using inhaled corticosteroids can prevent flare-ups before they start.",
      "COPD is progressive but not helpless. Pulmonary rehabilitation, smoking cessation, and proper inhaler technique can dramatically improve your quality of life.",
      "If you're waking up tired despite a full night's sleep, sleep apnea could be the culprit. A home sleep study can diagnose this condition and CPAP therapy can be life-changing.",
      "That chronic cough lasting more than 8 weeks needs investigation. Possible causes include post-nasal drip, asthma, GERD, or medication side effects.",
      "Pneumonia recovery takes time — fatigue and cough can persist for weeks even after the infection clears. Stay hydrated and give your body the rest it needs.",
      "Smoking cessation is the single most effective intervention for lung health. Within weeks of quitting, lung function begins to improve. Let's discuss cessation aids.",
      "Inhaler technique matters enormously. Up to 90% of patients use their inhalers incorrectly. I'd like to observe your technique and ensure you're getting the full dose.",
      "Wheezing is the sound of narrowed airways. While asthma is the most common cause, other conditions like vocal cord dysfunction or GERD can cause similar symptoms.",
      "Allergy testing can identify triggers that worsen respiratory symptoms. Environmental control measures combined with medications often provide excellent relief.",
    ],
  },
  {
    id: 'doctor-11',
    name: 'Dr. Amir Hosseini',
    specialty: 'Gastroenterology',
    initials: 'AH',
    bio: 'Gastroenterologist specializing in inflammatory bowel disease (Crohn\'s and ulcerative colitis), liver disease, and advanced endoscopic procedures. Focuses on gut-brain connection.',
    rating: 4.7,
    availability: true,
    keywords: [
      'stomach', 'abdominal', 'digestive', 'IBS', 'IBD', 'Crohn', 'colitis',
      'acid reflux', 'GERD', 'heartburn', 'nausea', 'vomiting', 'diarrhea',
      'constipation', 'bloating', 'gas', 'colonoscopy', 'liver', 'ulcer',
      'gallbladder', 'pancreas', 'celiac', 'gluten', 'gut',
    ],
    replies: [
      "Chronic bloating and abdominal discomfort could indicate IBS, food intolerances, or SIBO. A detailed food and symptom diary for 2 weeks is a great starting point for identifying patterns.",
      "GERD isn't just about heartburn — chronic acid reflux can damage the esophagus over time. Lifestyle changes like elevating the head of your bed and avoiding late meals can help significantly.",
      "Inflammatory bowel disease requires a multidisciplinary approach. We'll work together to find medications that induce and maintain remission while monitoring for complications.",
      "Colonoscopy is the most effective tool we have for colorectal cancer prevention. For average-risk individuals, screening begins at age 45 and can detect issues years before symptoms develop.",
      "Persistent diarrhea warrants stool testing to rule out infections, inflammation markers, and malabsorption issues. Keeping hydrated with electrolyte solutions is crucial in the meantime.",
      "The gut-brain axis is fascinating — stress and anxiety can directly trigger digestive symptoms. Mind-body approaches like cognitive behavioral therapy can be as important as medication.",
      "Celiac disease testing requires you to be eating gluten for accurate results. Don't start a gluten-free diet before testing — it can lead to false negatives.",
      "Liver health is supported by moderating alcohol intake, maintaining a healthy weight, and avoiding unnecessary medications. Fatty liver disease is reversible with lifestyle changes.",
      "Constipation often responds to increased fiber, water intake, and regular exercise. If these don't help, we'll investigate for underlying causes like hypothyroidism or pelvic floor dysfunction.",
      "Nausea that persists for weeks could stem from various causes — gastric emptying issues, medications, inner ear problems, or even migraines. Let's work through the differential diagnosis systematically.",
    ],
  },
  {
    id: 'doctor-12',
    name: 'Dr. Maria Fernandez',
    specialty: 'Endocrinology',
    initials: 'MF',
    bio: 'Endocrinologist with expertise in diabetes management, thyroid disorders, metabolic syndrome, and hormonal imbalances. Certified diabetes educator passionate about patient empowerment.',
    rating: 4.8,
    availability: true,
    keywords: [
      'diabetes', 'thyroid', 'hormone', 'metabolism', 'weight', 'obesity',
      'insulin', 'blood sugar', 'glucose', 'adrenal', 'pituitary', 'fatigue',
      'hot flashes', 'sweating', 'hunger', 'thirst', 'urination', 'tired',
      'endocrine', 'menopause', 'testosterone', 'calcium', 'osteoporosis',
    ],
    replies: [
      "Diabetes management has been revolutionized by continuous glucose monitors and smart insulin pumps. These technologies can give you real-time insights into how food and activity affect your blood sugar.",
      "Thyroid disorders are incredibly common, especially in women. Symptoms like fatigue, weight changes, and temperature sensitivity often respond well to medication once properly diagnosed.",
      "Unexplained weight gain despite diet and exercise could indicate hypothyroidism, insulin resistance, or cortisol imbalance. Blood work can help identify which hormonal pathway is affected.",
      "Frequent urination and excessive thirst are classic signs of elevated blood sugar. A simple HbA1c test can diagnose diabetes or prediabetes within minutes.",
      "The hemoglobin A1c test reflects your average blood sugar over the past 3 months. An A1c below 5.7% is normal; 5.7-6.4% indicates prediabetes; 6.5% or above indicates diabetes.",
      "Metabolic syndrome — a cluster of high blood pressure, high blood sugar, excess abdominal fat, and abnormal cholesterol — significantly increases heart disease risk. The good news: it's reversible.",
      "Adrenal fatigue is not a recognized medical diagnosis, but adrenal insufficiency is a serious condition that requires testing. Let's check your cortisol levels properly.",
      "Osteoporosis screening with a DEXA scan is recommended for postmenopausal women and others at risk. Calcium and vitamin D are essential, but weight-bearing exercise is equally important.",
      "Prediabetes is your warning sign — and your opportunity. With lifestyle changes, many people can prevent or delay progression to type 2 diabetes entirely.",
      "Hormonal imbalances can affect everything from mood to metabolism to menstrual cycles. A comprehensive endocrine panel can help us understand what's out of balance.",
    ],
  },
];

/**
 * Finds a doctor by their unique ID.
 * @param {string} id
 * @returns {Object|undefined}
 */
export function getDoctorById(id) {
  return doctors.find(doctor => doctor.id === id);
}

/**
 * Calculates a match score for a doctor based on user symptom keywords.
 * @param {Object} doctor - The doctor object.
 * @param {string[]} userKeywords - Array of user-provided symptom keywords.
 * @returns {number} Match score (0-100).
 */
export function calculateMatchScore(doctor, userKeywords) {
  if (!userKeywords || userKeywords.length === 0) return 0;

  const doctorKeywords = doctor.keywords.map(k => k.toLowerCase());
  let matches = 0;
  let totalWeight = 0;

  for (const userWord of userKeywords) {
    const word = userWord.toLowerCase();
    totalWeight += 1;
    if (doctorKeywords.some(dk => dk.includes(word) || word.includes(dk))) {
      // 2x weight modifier for keyword matches
      matches += 2;
    }
  }

  // Calculate score as percentage, capped at 100
  const score = Math.min(100, Math.round((matches / (totalWeight * 2)) * 100));
  return score;
}

/**
 * Gets the top matching doctors for a set of user symptoms.
 * @param {string[]} userKeywords
 * @param {number} limit - Maximum number of results.
 * @returns {Array<{ doctor: Object, score: number }>}
 */
export function getTopMatches(userKeywords, limit = 3) {
  const scored = doctors.map(doctor => ({
    doctor,
    score: calculateMatchScore(doctor, userKeywords),
  }));

  // Sort descending by score, keep those with score > 0
  scored.sort((a, b) => b.score - a.score);

  return scored.filter(item => item.score > 0).slice(0, limit);
}

export default doctors;
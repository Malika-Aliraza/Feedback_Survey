const SHEET_URL = "https://script.google.com/macros/s/AKfycbyPabTavnJaPwDhJJPcyznwDvXBR89JMP6hMOmbSkgW3AUweobM4-rQZzicGeS5OJp9/exec";

// ── TRANSLATIONS ──
const translations = {
  en: {
    // Landing
    landingHeading:  "Hello, I'm Malika —\nthank you for taking 5 minutes\nto share your thoughts.",
    landingSub:      "Your honest feedback on my internship experience means everything to me. Please share your details to get started.",
    labelName:       "Your name",
    labelPhone:      "Phone number",
    labelEmail:      "Email address",
    placeholderName:  "e.g. Amina, John…",
    placeholderPhone: "e.g. +255 712 345 678",
    placeholderEmail: "e.g. amina@crdb.com",
    btnBegin:        "Begin the survey →",

    // Survey
    tagline: "Your thoughts will help me grow.",
    q1Label: "How would you rate my overall performance during the internship?",
    q2Label: "What strengths did you notice in my work?",
    q2Sub:   "(Select all that apply)",
    q3Label: "What areas could I improve on?",
    q3Sub:   "(Select all that apply)",
    q4Label: "What is one specific moment or task where you felt I made a real contribution?",
    q4Placeholder: "Share a specific memory or moment…",
    q5Label: "On a scale of 0–10, how likely are you to recommend me to a future employer or colleague?",
    q6Label: "Any final advice or a message you'd like to leave for me?",
    q6Placeholder: "Your words matter deeply — share whatever feels right…",
    btnSubmit: "Submit feedback ✨",
    npsLow:  "Not likely",
    npsHigh: "Definitely",

    // Emoji labels
    emojiPoor:      "Poor",
    emojiFair:      "Fair",
    emojiGood:      "Good",
    emojiGreat:     "Great",
    emojiExcellent: "Excellent",

    // Strengths
    strengths: [
      "Communication skills", "Problem-solving ability",
      "Attention to detail",  "Initiative & proactivity",
      "Teamwork & collaboration", "Technical competence",
      "Adaptability",         "Positive attitude"
    ],

    // Improvements
    improvements: [
      "Time management",       "Taking more initiative",
      "Technical skills depth","Asking more questions",
      "Communication skills",   "Documentation habits",
      "Confidence in sharing ideas", "Meeting deadlines"
    ],

    // Thank you
    tyHeading: "Thank You",
    tyNote:    "Your feedback means the world to me.\nThank you for being part of my journey at CRDB.",
    tySig:     "— Malika 🌸",

    // Duplicate
    dupHeading: "Already Submitted",
    dupNote:    "It looks like you've already shared your feedback.\nYour response has been recorded — thank you!",
    dupSig:     "— Malika 💜",

    // Validation
    npsLowLabel: "Not likely",
    npsHighLabel: "Definitely",
  },

  sw: {
    // Landing
    landingHeading:  "Habari, mimi ni Malika \nasante kwa kutoa dakika 5\nkushiriki mawazo yako.",
    landingSub:      "Maoni yako ya kweli kuhusu uzoefu wangu wa mafunzo yananimaanisha sana. Tafadhali shiriki maelezo yako kuanza.",
    labelName:       "Jina lako",
    labelPhone:      "Nambari ya simu",
    labelEmail:      "Anwani ya barua pepe",
    placeholderName:  "mf. Amina, John…",
    placeholderPhone: "mf. +255 712 345 678",
    placeholderEmail: "mf. amina@crdb.com",
    btnBegin:        "Anza dodoso →",

    // Survey
    tagline: "Mawazo yako yatanisaidia kukua.",
    q1Label: "Unawezaje kutathmini utendaji wangu wa jumla wakati wa mafunzo?",
    q2Label: "Ni nguvu gani ulizoziona katika kazi yangu?",
    q2Sub:   "(Chagua zote zinazofaa)",
    q3Label: "Ni maeneo gani ninayoweza kuboresha?",
    q3Sub:   "(Chagua zote zinazofaa)",
    q4Label: "Ni wakati au kazi gani maalum ambapo ulihisi nilifanya mchango wa kweli?",
    q4Placeholder: "Shiriki kumbukumbu au wakati maalum…",
    q5Label: "Kwa kiwango cha 0–10, una uwezekano gani wa kunipendekeza kwa mwajiri au mwenzako wa siku zijazo?",
    q6Label: "Je, una ushauri wowote wa mwisho au ujumbe unaotaka kuniachia?",
    q6Placeholder: "Maneno yako yana maana sana — shiriki chochote unachohisi ni sawa…",
    btnSubmit: "Wasilisha maoni ✨",
    npsLow:  "Haiwezekani",
    npsHigh: "Bila shaka",

    // Emoji labels
    emojiPoor:      "Mbaya",
    emojiFair:      "Wastani",
    emojiGood:      "Nzuri",
    emojiGreat:     "Vizuri sana",
    emojiExcellent: "Bora kabisa",

    // Strengths
    strengths: [
      "Ujuzi wa mawasiliano",   "Uwezo wa kutatua matatizo",
      "Makini kwa undani",      "Mpango na utendaji",
      "Ushirikiano wa timu",    "Ujuzi wa kiufundi",
      "Uwezo wa kuzoea",        "Mtazamo mzuri"
    ],

    // Improvements
    improvements: [
      "Usimamizi wa muda",         "Kuchukua hatua zaidi",
      "Kina cha ujuzi wa kiufundi","Kuuliza maswali zaidi",
      "Ujuzi wa mawasiliano",     "Tabia ya kuandika nyaraka",
      "Ujasiri wa kushiriki mawazo","Kukutana na mwisho wa muda"
    ],

    // Thank you
    tyHeading: "Asante",
    tyNote:    "Maoni yako yanamaanisha ulimwengu wangu.\nAsante kwa kuwa sehemu ya safari yangu CRDB.",
    tySig:     "— Malika 🌸",

    // Duplicate
    dupHeading: "Tayari Umewasilisha",
    dupNote:    "Inaonekana tayari umeshiriki maoni yako.\nJibu lako limerekodiwa — asante!",
    dupSig:     "— Malika 💜",

    npsLowLabel: "Haiwezekani",
    npsHighLabel: "Bila shaka",
  }
};

let currentLang = 'en';

// ── SET LANGUAGE ──
function setLanguage(lang) {
  currentLang = lang;
  const t = translations[lang];

  // Toggle button states
  document.getElementById('btn-en').classList.toggle('active', lang === 'en');
  document.getElementById('btn-sw').classList.toggle('active', lang === 'sw');

  // ── LANDING ──
  document.querySelector('.greeting-heading').innerText  = t.landingHeading;
  document.querySelector('.greeting-sub').innerText      = t.landingSub;
  document.getElementById('name-field').placeholder      = t.placeholderName;
  document.getElementById('phone-field').placeholder     = t.placeholderPhone;
  document.getElementById('email-field').placeholder     = t.placeholderEmail;
  document.querySelector('.btn-primary').innerText       = t.btnBegin;

  // Labels
  const labels = document.querySelectorAll('.name-label');
  labels[0].innerText = t.labelName;
  labels[1].innerText = t.labelPhone;
  labels[2].innerText = t.labelEmail;

  // ── SURVEY ──
  document.querySelector('.survey-tagline').innerText = t.tagline;

  // Question labels
  const qLabels = document.querySelectorAll('.q-label');
  qLabels[0].innerHTML = `<span class="q-num">1</span>${t.q1Label}`;
  qLabels[1].innerHTML = `<span class="q-num">2</span>${t.q2Label} <span style="font-size:12px;color:#a898b8;font-weight:300;">${t.q2Sub}</span>`;
  qLabels[2].innerHTML = `<span class="q-num">3</span>${t.q3Label} <span style="font-size:12px;color:#a898b8;font-weight:300;">${t.q3Sub}</span>`;
  qLabels[3].innerHTML = `<span class="q-num">4</span>${t.q4Label}`;
  qLabels[4].innerHTML = `<span class="q-num">5</span>${t.q5Label}`;
  qLabels[5].innerHTML = `<span class="q-num">6</span>${t.q6Label}`;

  // Emoji labels
  const emojiBtns = document.querySelectorAll('.emoji-btn span');
  emojiBtns[0].innerText = t.emojiPoor;
  emojiBtns[1].innerText = t.emojiFair;
  emojiBtns[2].innerText = t.emojiGood;
  emojiBtns[3].innerText = t.emojiGreat;
  emojiBtns[4].innerText = t.emojiExcellent;

  // Emoji data-labels
  const emojiButtons = document.querySelectorAll('.emoji-btn');
  emojiButtons[0].setAttribute('data-label', t.emojiPoor      + ' (1)');
  emojiButtons[1].setAttribute('data-label', t.emojiFair      + ' (2)');
  emojiButtons[2].setAttribute('data-label', t.emojiGood      + ' (3)');
  emojiButtons[3].setAttribute('data-label', t.emojiGreat     + ' (4)');
  emojiButtons[4].setAttribute('data-label', t.emojiExcellent + ' (5)');

  // Strengths buttons
  const strengthBtns = document.querySelectorAll('#q2-strengths .choice-btn');
  t.strengths.forEach((s, i) => { if (strengthBtns[i]) strengthBtns[i].innerText = s; });

  // Improvement buttons
  const improveBtns = document.querySelectorAll('#q3-improve .choice-btn');
  t.improvements.forEach((s, i) => { if (improveBtns[i]) improveBtns[i].innerText = s; });

  // Textareas
  document.getElementById('q4-moment').placeholder = t.q4Placeholder;
  document.getElementById('q6-advice').placeholder = t.q6Placeholder;

  // NPS labels
  const npsLabels = document.querySelectorAll('.nps-labels span');
  npsLabels[0].innerText = t.npsLow;
  npsLabels[1].innerText = t.npsHigh;

  // Submit button
  document.querySelector('.btn-submit').innerText = t.btnSubmit;

  // ── THANK YOU ──
  document.querySelector('.ty-heading').innerText = t.tyHeading;
  document.querySelector('.ty-note').innerText    = t.tyNote;
  document.querySelector('.ty-crdb').innerText    = t.tySig;

  // ── DUPLICATE ──
  document.querySelector('.duplicate-inner .ty-heading').innerText = t.dupHeading;
  document.querySelector('.duplicate-inner .ty-note').innerText    = t.dupNote;
  document.querySelector('.duplicate-inner .ty-crdb').innerText    = t.dupSig;
}

// ── PAGE NAVIGATION ──
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.style.display = 'none';
  });
  const el = document.getElementById(id);
  el.style.display = 'flex';
  requestAnimationFrame(() => el.classList.add('active'));
}

// ── PROGRESS BAR ──
function updateProgress() {
  const total = 6;
  let answered = 0;

  if (document.querySelector('#q1-emoji .selected'))   answered++;
  if (document.querySelector('#q2-strengths .selected')) answered++;
  if (document.querySelector('#q3-improve .selected'))  answered++;
  if (document.getElementById('q4-moment').value.trim()) answered++;
  if (document.querySelector('#q5-nps .selected'))      answered++;
  if (document.getElementById('q6-advice').value.trim()) answered++;

  const pct = Math.round((answered / total) * 100);
  document.getElementById('progress-fill').style.width = pct + '%';
}

// ── LANDING PAGE ──
// ── LANDING PAGE ──
function beginSurvey() {
  const nameVal  = document.getElementById('name-field').value.trim();
  const phoneVal = document.getElementById('phone-field').value.trim();
  const emailVal = document.getElementById('email-field').value.trim();

  let hasError = false;

  // Validate name
  if (!nameVal) {
    setError('name-field', true);
    hasError = true;
  } else {
    setError('name-field', false);
  }

  // Validate phone
  if (!phoneVal) {
    setError('phone-field', true);
    hasError = true;
  } else {
    setError('phone-field', false);
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailVal || !emailRegex.test(emailVal)) {
    setError('email-field', true);
    hasError = true;
  } else {
    setError('email-field', false);
  }

  if (hasError) return;

  document.getElementById('survey-greeting').textContent = 'Hello, ' + nameVal + ' ✨';
  showPage('page-survey');
}

function setError(fieldId, isError) {
  const field = document.getElementById(fieldId);
  if (isError) {
    field.classList.add('error');
    setTimeout(() => field.classList.remove('error'), 2000);
  } else {
    field.classList.remove('error');
  }
}

// ── EMOJI SCALE ──
function selectEmoji(btn) {
  const row = btn.closest('.emoji-row');
  row.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  updateProgress();
}

// ── NPS SCALE ──
function selectNPS(btn) {
  const row = btn.closest('.nps-row');
  row.querySelectorAll('.nps-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  updateProgress();
}

// ── MULTI CHOICE ──
function toggleChoice(btn) {
  btn.classList.toggle('selected');
  updateProgress();
}

// ── COLLECT ANSWERS ──
// ── COLLECT ANSWERS ──
function collectAnswers() {
  const name  = document.getElementById('name-field').value.trim();
  const phone = document.getElementById('phone-field').value.trim();
  const email = document.getElementById('email-field').value.trim();

  const q1 = document.querySelector('#q1-emoji .selected')
    ?.getAttribute('data-label') || '';

  const q2 = [...document.querySelectorAll('#q2-strengths .selected')]
    .map(b => b.textContent.trim()).join(', ');

  const q3 = [...document.querySelectorAll('#q3-improve .selected')]
    .map(b => b.textContent.trim()).join(', ');

  const q4 = document.getElementById('q4-moment').value.trim();
  const q5 = document.querySelector('#q5-nps .selected')?.textContent.trim();
  const q6 = document.getElementById('q6-advice').value.trim();

  return { name, phone, email, q1, q2, q3, q4, q5, q6 };
}

// ── DEVICE FINGERPRINT ──
function getDeviceFingerprint() {
  const raw = [
    navigator.language,
    navigator.platform,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.hardwareConcurrency,
    navigator.deviceMemory || 'unknown'
  ].join('|');

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// ── SUBMIT ──
// ── SUBMIT ──
async function submitSurvey() {
  const btn = document.querySelector('.btn-submit');

  // Device check
  if (localStorage.getItem('malika_survey_submitted') === 'true') {
    showAlreadySubmitted();
    return;
  }

  // ── MANDATORY VALIDATION ──
  const answers = collectAnswers();
  let firstError = null;

  if (!answers.q1) {
    firstError = firstError || 'q1-emoji';
    highlightError('q1-emoji');
  }
  if (!answers.q2) {
    firstError = firstError || 'q2-strengths';
    highlightError('q2-strengths');
  }
  if (!answers.q3) {
    firstError = firstError || 'q3-improve';
    highlightError('q3-improve');
  }
  if (!answers.q4) {
    firstError = firstError || 'q4-moment';
    highlightError('q4-moment');
  }
  if (!answers.q5) {
    firstError = firstError || 'q5-nps';
    highlightError('q5-nps');
  }
  if (!answers.q6) {
    firstError = firstError || 'q6-advice';
    highlightError('q6-advice');
  }

  if (firstError) {
    // Scroll to first unanswered question
    document.getElementById(firstError)
      .closest('.question-card')
      .scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  btn.textContent = 'Sending... ✨';
  btn.disabled    = true;

  const fingerprint = getDeviceFingerprint();

  try {
    await fetch(SHEET_URL, {
      method:  'POST',
      mode:    'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:            answers.name,
        phone:           answers.phone,
        email:           answers.email,
        q1_performance:  answers.q1,
        q2_strengths:    answers.q2,
        q3_improvements: answers.q3,
        q4_moment:       answers.q4,
        q5_recommend:    answers.q5,
        q6_advice:       answers.q6,
        fingerprint:     fingerprint
      })
    });

    localStorage.setItem('malika_survey_submitted', 'true');
    localStorage.setItem('malika_survey_name', answers.name);
    localStorage.setItem('malika_survey_fingerprint', fingerprint);

  } catch (err) {
    console.error('Submission error:', err);
    btn.textContent = 'Submit my feedback ✨';
    btn.disabled    = false;
    return;
  }

  showPage('page-thankyou');
  setTimeout(createSparkles, 400);
}

// ── HIGHLIGHT UNANSWERED QUESTION ──
function highlightError(id) {
  const el = document.getElementById(id);
  const card = el.closest('.question-card');
  card.style.border = '1.5px solid rgba(220, 100, 140, 0.6)';
  card.style.boxShadow = '0 0 0 4px rgba(220, 100, 140, 0.08)';
  setTimeout(() => {
    card.style.border = '';
    card.style.boxShadow = '';
  }, 3000);
}

// ── ALREADY SUBMITTED ──
function showAlreadySubmitted() {
  const name = localStorage.getItem('malika_survey_name') || 'there';
  document.getElementById('duplicate-name').textContent = name;
  showPage('page-duplicate');
}

// ── SPARKLES ──
function createSparkles() {
  const colors = ['#e0a0f0', '#a0c0f8', '#a0e8d0', '#f8d090', '#f0b0c8'];

  for (let i = 0; i < 22; i++) {
    const sp    = document.createElement('div');
    sp.className = 'sparkle';

    const size  = 10 + Math.random() * 20;
    const x     = 5  + Math.random() * 90;
    const y     = 5  + Math.random() * 90;
    const delay = Math.random() * 2.5;
    const dur   = 1.8 + Math.random() * 2;
    const color = colors[Math.floor(Math.random() * colors.length)];

    sp.style.cssText = `
      left: ${x}%;
      top: ${y}%;
      animation-delay: ${delay}s;
      animation-duration: ${dur}s;
    `;
    sp.innerHTML = `
      <svg width="${size}" height="${size}" viewBox="0 0 20 20">
        <path d="M10 1 L11.5 8.5 L19 10 L11.5 11.5 L10 19 L8.5 11.5 L1 10 L8.5 8.5 Z"
              fill="${color}"/>
      </svg>`;

    document.body.appendChild(sp);
  }
}

// ── FLOATING PETALS ──
function createPetals() {
  const colors    = ['#e8a8d8', '#a8c8f0', '#a8e8d0', '#f0d0a8', '#d0b0f0'];
  const sizes     = [30, 40, 50, 60, 35];
  const positions = [
    { top: '8%',    left: '6%'   },
    { top: '10%',   right: '8%'  },
    { top: '50%',   left: '3%'   },
    { bottom: '15%', left: '10%' },
    { bottom: '18%', right: '6%' },
  ];

  positions.forEach((pos, i) => {
    const petal     = document.createElement('div');
    petal.className = 'petal';

    petal.style.cssText = `
      width: ${sizes[i]}px;
      height: ${sizes[i]}px;
      background: ${colors[i]};
      animation-delay: ${i * 2}s;
      ${Object.entries(pos).map(([k, v]) => `${k}:${v}`).join(';')};
    `;
    document.body.appendChild(petal);
  });
}

// ── ON LOAD ──
document.addEventListener('DOMContentLoaded', () => {
  createPetals();

  // Check localStorage first
  if (localStorage.getItem('malika_survey_submitted') === 'true') {
    showAlreadySubmitted();
  }

  // Enter key on name input
  document.getElementById('name-field').addEventListener('keydown', e => {
    if (e.key === 'Enter') beginSurvey();
  });

  // Progress bar on textarea input
  document.getElementById('q4-moment').addEventListener('input', updateProgress);
  document.getElementById('q6-advice').addEventListener('input', updateProgress);
});
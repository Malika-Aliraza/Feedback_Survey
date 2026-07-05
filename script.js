// ── SHEET URL ──
const SHEET_URL = "https://script.google.com/macros/s/AKfycbym5fYOyorhz4yGrWMiJpzRNbL_-19x72cLBiYoKxESKDkNcXll6q2-IosBnzbDv4f5/exec";

// ── DEVICE DETECTION ──
const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent)
  || window.innerWidth <= 768
  || ('ontouchstart' in window)
  || (navigator.maxTouchPoints > 0);

// ════════════════════════════════════════
// CURSOR — desktop only
// ════════════════════════════════════════
let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

function initCursor() {
  if (isMobile) return;

  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursor-ring');

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();
}

function addCursorHover() {
  if (isMobile) return;
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursor-ring');
  document.querySelectorAll('button, input, textarea, a').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovered');
      cursorRing.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovered');
      cursorRing.classList.remove('hovered');
    });
  });
}

// ════════════════════════════════════════
// TAP RIPPLE — mobile only
// ════════════════════════════════════════
function initTapRipple() {
  if (!isMobile) return;

  document.addEventListener('click', e => {
    const targets = ['BUTTON', 'INPUT', 'TEXTAREA'];
    const el = e.target.closest('button, .question-card, .field-input');
    if (!el) return;

    const ripple = document.createElement('div');
    ripple.className = 'ripple';

    const rect = el.getBoundingClientRect();
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top  = (e.clientY - rect.top)  + 'px';

    el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.appendChild(ripple);

    setTimeout(() => ripple.remove(), 800);
  });
}

// ════════════════════════════════════════
// TILT PARALLAX — mobile only
// ════════════════════════════════════════
function initTiltParallax() {
  if (!isMobile) return;
  if (!window.DeviceOrientationEvent) return;

  const layers = [
    { selector: '#bg-monogram', strength: 8  },
    { selector: '.gold-orb',    strength: 14 },
    { selector: '.petal',       strength: 6  },
  ];

  let lastBeta  = 0;
  let lastGamma = 0;

  // request permission on iOS 13+
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    document.addEventListener('click', () => {
      DeviceOrientationEvent.requestPermission().catch(() => {});
    }, { once: true });
  }

  window.addEventListener('deviceorientation', e => {
    const beta  = e.beta  || 0;   // front-back tilt
    const gamma = e.gamma || 0;   // left-right tilt

    // smooth it
    lastBeta  += (beta  - lastBeta)  * 0.08;
    lastGamma += (gamma - lastGamma) * 0.08;

    const clampedBeta  = Math.max(-30, Math.min(30, lastBeta));
    const clampedGamma = Math.max(-30, Math.min(30, lastGamma));

    layers.forEach(({ selector, strength }) => {
      document.querySelectorAll(selector).forEach(el => {
        const x = (clampedGamma / 30) * strength;
        const y = (clampedBeta  / 30) * strength;
        el.style.transform = `translate(${x}px, ${y}px)`;
        el.style.transition = 'transform 0.1s ease-out';
      });
    });
  });
}

// ════════════════════════════════════════
// SCROLL REVEAL — mobile + desktop
// ════════════════════════════════════════
function initScrollReveal() {
  const cards = document.querySelectorAll('.question-card');
  cards.forEach(card => card.classList.add('reveal'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, isMobile ? i * 80 : i * 50);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(card => observer.observe(card));
}

// ════════════════════════════════════════
// PAGE NAVIGATION
// ════════════════════════════════════════
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active', 'enter');
    p.style.display = 'none';
  });

  const el = document.getElementById(id);
  el.style.display = 'flex';
  requestAnimationFrame(() => {
    el.classList.add('active');
    requestAnimationFrame(() => {
      el.classList.add('enter');
      // re-run scroll reveal for survey page
      if (id === 'page-survey') {
        setTimeout(initScrollReveal, 100);
      }
    });
  });

  addCursorHover();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ════════════════════════════════════════
// TRANSLATIONS
// ════════════════════════════════════════
const translations = {
  en: {
    landingHeading:   "Hello, I'm Malika —\nthank you for taking\nfive minutes of your time.",
    landingSub:       "Your honest words are the compass\nthat guides my next chapter.",
    labelName:        "Your name",
    labelPhone:       "Phone number",
    labelEmail:       "Email address",
    placeholderName:  "e.g. Amina, John…",
    placeholderPhone: "+255 712 345 678",
    placeholderEmail: "amina@crdb.com",
    btnBegin:         "Begin the survey",
    tagline:          "Your thoughts will help me grow. Each answer is a gift.",
    q1Label:          "How would you rate my overall performance during the internship?",
    q2Label:          "What strengths did you notice in my work?",
    q2Sub:            "(Select all that apply)",
    q3Label:          "What areas could I improve on?",
    q3Sub:            "(Select all that apply)",
    q4Label:          "What is one specific moment where you felt I made a real contribution?",
    q4Placeholder:    "Your words, however brief, are treasured…",
    q5Label:          "On a scale of 0–10, how likely are you to recommend me to a future employer?",
    q6Label:          "Any final advice or a message you'd like to leave for me?",
    q6Placeholder:    "Your wisdom lights the road ahead…",
    btnSubmit:        "Submit my feedback ✦",
    npsLow:           "Not likely",
    npsHigh:          "Definitely",
    emojiPoor:        "Poor",
    emojiFair:        "Fair",
    emojiGood:        "Good",
    emojiGreat:       "Great",
    emojiExcellent:   "Excellent",
    strengths: [
      "Communication skills",     "Problem-solving ability",
      "Attention to detail",      "Initiative & proactivity",
      "Teamwork & collaboration", "Technical competence",
      "Adaptability",             "Positive attitude"
    ],
    improvements: [
      "Time management",             "Taking more initiative",
      "Technical skills depth",      "Asking more questions",
      "Presentation skills",         "Documentation habits",
      "Confidence in sharing ideas", "Meeting deadlines"
    ],
    tyHeading: "Thank You",
    tyNote:    "Your feedback means the world to me.\nThank you for being part of my\njourney at CRDB.",
    tySig:     "MALIKA · CRDB BANK · 2025",
    dupHeading:"Already Submitted",
    dupNote:   "It looks like you've already shared\nyour feedback. Your response has\nbeen recorded — thank you.",
    dupSig:    "MALIKA · CRDB BANK · 2025",
  },
  sw: {
    landingHeading:   "Habari, mimi ni Malika —\nasante kwa kutoa\ndakika tano za wakati wako.",
    landingSub:       "Maneno yako ya kweli ni dira\nInayoongoza hatua zangu zijazo.",
    labelName:        "Jina lako",
    labelPhone:       "Nambari ya simu",
    labelEmail:       "Anwani ya barua pepe",
    placeholderName:  "mf. Amina, John…",
    placeholderPhone: "+255 712 345 678",
    placeholderEmail: "amina@crdb.com",
    btnBegin:         "Anza dodoso",
    tagline:          "Mawazo yako yatanisaidia kukua. Kila jibu ni zawadi.",
    q1Label:          "Unawezaje kutathmini utendaji wangu wakati wa mafunzo?",
    q2Label:          "Ni nguvu gani ulizoziona katika kazi yangu?",
    q2Sub:            "(Chagua zote zinazofaa)",
    q3Label:          "Ni maeneo gani ninayoweza kuboresha?",
    q3Sub:            "(Chagua zote zinazofaa)",
    q4Label:          "Ni wakati gani maalum ambapo ulihisi nilifanya mchango wa kweli?",
    q4Placeholder:    "Maneno yako, hata mafupi, yanathaminiwa…",
    q5Label:          "Kwa kiwango cha 0–10, una uwezekano gani wa kunipendekeza?",
    q6Label:          "Je, una ushauri wowote wa mwisho au ujumbe unaotaka kuniachia?",
    q6Placeholder:    "Hekima yako inawasha njia iliyo mbele…",
    btnSubmit:        "Wasilisha maoni yangu ✦",
    npsLow:           "Haiwezekani",
    npsHigh:          "Bila shaka",
    emojiPoor:        "Mbaya",
    emojiFair:        "Wastani",
    emojiGood:        "Nzuri",
    emojiGreat:       "Vizuri sana",
    emojiExcellent:   "Bora kabisa",
    strengths: [
      "Ujuzi wa mawasiliano",    "Uwezo wa kutatua matatizo",
      "Makini kwa undani",       "Mpango na utendaji",
      "Ushirikiano wa timu",     "Ujuzi wa kiufundi",
      "Uwezo wa kuzoea",         "Mtazamo mzuri"
    ],
    improvements: [
      "Usimamizi wa muda",           "Kuchukua hatua zaidi",
      "Kina cha ujuzi wa kiufundi",  "Kuuliza maswali zaidi",
      "Ujuzi wa uwasilishaji",       "Tabia ya kuandika nyaraka",
      "Ujasiri wa kushiriki mawazo", "Kukutana na mwisho wa muda"
    ],
    tyHeading: "Asante",
    tyNote:    "Maoni yako yanamaanisha ulimwengu wangu.\nAsante kwa kuwa sehemu ya safari\nyangu CRDB.",
    tySig:     "MALIKA · CRDB BANK · 2025",
    dupHeading:"Tayari Umewasilisha",
    dupNote:   "Inaonekana tayari umeshiriki maoni yako.\nJibu lako limerekodiwa — asante!",
    dupSig:    "MALIKA · CRDB BANK · 2025",
  }
};

let currentLang = 'en';

function setLanguage(lang) {
  currentLang = lang;
  const t = translations[lang];

  document.getElementById('btn-en').classList.toggle('active', lang === 'en');
  document.getElementById('btn-sw').classList.toggle('active', lang === 'sw');

  // Landing
  document.querySelector('.main-heading').innerHTML =
    t.landingHeading.split('\n').join('<br>').replace('Malika', '<em>Malika</em>');
  document.querySelector('.tagline').innerHTML =
    t.landingSub.split('\n').join('<br>');
  document.getElementById('name-field').placeholder  = t.placeholderName;
  document.getElementById('phone-field').placeholder = t.placeholderPhone;
  document.getElementById('email-field').placeholder = t.placeholderEmail;

  const labels = document.querySelectorAll('.field-label');
  labels[0].innerText = t.labelName;
  labels[1].innerText = t.labelPhone;
  labels[2].innerText = t.labelEmail;

  // Survey
  document.querySelector('.survey-tagline').innerText = t.tagline;

  const qLabels = document.querySelectorAll('.q-label');
  qLabels[0].innerHTML = `<span class="q-num">I.</span>${t.q1Label}`;
  qLabels[1].innerHTML = `<span class="q-num">II.</span>${t.q2Label} <span class="q-sub">${t.q2Sub}</span>`;
  qLabels[2].innerHTML = `<span class="q-num">III.</span>${t.q3Label} <span class="q-sub">${t.q3Sub}</span>`;
  qLabels[3].innerHTML = `<span class="q-num">IV.</span>${t.q4Label}`;
  qLabels[4].innerHTML = `<span class="q-num">V.</span>${t.q5Label}`;
  qLabels[5].innerHTML = `<span class="q-num">VI.</span>${t.q6Label}`;

  const emojiSpans = document.querySelectorAll('.emoji-btn span');
  emojiSpans[0].innerText = t.emojiPoor;
  emojiSpans[1].innerText = t.emojiFair;
  emojiSpans[2].innerText = t.emojiGood;
  emojiSpans[3].innerText = t.emojiGreat;
  emojiSpans[4].innerText = t.emojiExcellent;

  const emojiButtons = document.querySelectorAll('.emoji-btn');
  emojiButtons[0].setAttribute('data-label', t.emojiPoor      + ' (1)');
  emojiButtons[1].setAttribute('data-label', t.emojiFair      + ' (2)');
  emojiButtons[2].setAttribute('data-label', t.emojiGood      + ' (3)');
  emojiButtons[3].setAttribute('data-label', t.emojiGreat     + ' (4)');
  emojiButtons[4].setAttribute('data-label', t.emojiExcellent + ' (5)');

  document.querySelectorAll('#q2-strengths .choice-btn')
    .forEach((b, i) => { if (t.strengths[i])    b.innerText = t.strengths[i]; });
  document.querySelectorAll('#q3-improve .choice-btn')
    .forEach((b, i) => { if (t.improvements[i]) b.innerText = t.improvements[i]; });

  document.getElementById('q4-moment').placeholder = t.q4Placeholder;
  document.getElementById('q6-advice').placeholder = t.q6Placeholder;

  const npsLabels = document.querySelectorAll('.nps-labels span');
  npsLabels[0].innerText = t.npsLow;
  npsLabels[1].innerText = t.npsHigh;

  document.querySelector('.btn-submit').innerText = t.btnSubmit;

  document.querySelector('.ty-heading').innerText  = t.tyHeading;
  document.querySelector('.ty-note').innerHTML     = t.tyNote.split('\n').join('<br>');
  document.querySelector('.ty-crdb').innerText     = t.tySig;

  document.querySelector('.duplicate-inner .ty-heading').innerText = t.dupHeading;
  document.querySelector('.duplicate-inner .ty-note').innerHTML    = t.dupNote.split('\n').join('<br>');
  document.querySelector('.duplicate-inner .ty-crdb').innerText    = t.dupSig;
}

// ════════════════════════════════════════
// LANDING
// ════════════════════════════════════════
function beginSurvey() {
  const nameVal  = document.getElementById('name-field').value.trim();
  const phoneVal = document.getElementById('phone-field').value.trim();
  const emailVal = document.getElementById('email-field').value.trim();
  const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let error      = false;

  [
    ['name-field',  !!nameVal],
    ['phone-field', !!phoneVal],
    ['email-field', !!emailVal && emailReg.test(emailVal)]
  ].forEach(([id, valid]) => {
    const el = document.getElementById(id);
    if (!valid) {
      el.classList.add('error');
      setTimeout(() => el.classList.remove('error'), 2000);
      error = true;
    }
  });

  if (error) return;

  document.getElementById('survey-greeting').textContent =
    'Hello, ' + nameVal + ' ✦';
  showPage('page-survey');
}

// ════════════════════════════════════════
// SURVEY INTERACTIONS
// ════════════════════════════════════════
function selectEmoji(btn) {
  btn.closest('.emoji-row')
    .querySelectorAll('.emoji-btn')
    .forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  updateProgress();
}

function selectNPS(btn) {
  btn.closest('.nps-row')
    .querySelectorAll('.nps-btn')
    .forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  updateProgress();
}

function toggleChoice(btn) {
  btn.classList.toggle('selected');
  updateProgress();
}

// ════════════════════════════════════════
// PROGRESS BAR
// ════════════════════════════════════════
function updateProgress() {
  let done = 0;
  const total = 6;

  if (document.querySelector('#q1-emoji .selected'))     done++;
  if (document.querySelector('#q2-strengths .selected')) done++;
  if (document.querySelector('#q3-improve .selected'))   done++;
  if (document.getElementById('q4-moment').value.trim()) done++;
  if (document.querySelector('#q5-nps .selected'))       done++;
  if (document.getElementById('q6-advice').value.trim()) done++;

  document.getElementById('progress-fill').style.width =
    Math.round((done / total) * 100) + '%';
}

// ════════════════════════════════════════
// COLLECT ANSWERS
// ════════════════════════════════════════
function collectAnswers() {
  return {
    name:  document.getElementById('name-field').value.trim(),
    phone: document.getElementById('phone-field').value.trim(),
    email: document.getElementById('email-field').value.trim(),
    q1:    document.querySelector('#q1-emoji .selected')
             ?.getAttribute('data-label') || '',
    q2:    [...document.querySelectorAll('#q2-strengths .selected')]
             .map(b => b.textContent.trim()).join(', '),
    q3:    [...document.querySelectorAll('#q3-improve .selected')]
             .map(b => b.textContent.trim()).join(', '),
    q4:    document.getElementById('q4-moment').value.trim(),
    q5:    document.querySelector('#q5-nps .selected')
             ?.textContent.trim() || '',
    q6:    document.getElementById('q6-advice').value.trim(),
  };
}

// ════════════════════════════════════════
// VALIDATE
// ════════════════════════════════════════
function validateSurvey(answers) {
  const checks = [
    { value: answers.q1, id: 'q1-emoji'     },
    { value: answers.q2, id: 'q2-strengths' },
    { value: answers.q3, id: 'q3-improve'   },
    { value: answers.q4, id: 'q4-moment'    },
    { value: answers.q5, id: 'q5-nps'       },
    { value: answers.q6, id: 'q6-advice'    },
  ];

  let firstError = null;

  checks.forEach(({ value, id }) => {
    if (!value) {
      const card = document.getElementById(id).closest('.question-card');
      card.classList.add('error-card');
      setTimeout(() => card.classList.remove('error-card'), 3000);
      if (!firstError) firstError = id;
    }
  });

  if (firstError) {
    document.getElementById(firstError)
      .closest('.question-card')
      .scrollIntoView({ behavior: 'smooth', block: 'center' });
    return false;
  }
  return true;
}

// ════════════════════════════════════════
// DEVICE FINGERPRINT
// ════════════════════════════════════════
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

  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) - hash) + raw.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// ════════════════════════════════════════
// SUBMIT
// ════════════════════════════════════════
async function submitSurvey() {
  if (localStorage.getItem('malika_survey_submitted') === 'true') {
    showAlreadySubmitted();
    return;
  }

  const answers = collectAnswers();
  if (!validateSurvey(answers)) return;

  const btn = document.querySelector('.btn-submit');
  btn.textContent = 'Sending… ✦';
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

    localStorage.setItem('malika_survey_submitted',    'true');
    localStorage.setItem('malika_survey_name',         answers.name);
    localStorage.setItem('malika_survey_fingerprint',  fingerprint);

  } catch (err) {
    console.error('Submission error:', err);
    btn.textContent = 'Submit my feedback ✦';
    btn.disabled    = false;
    return;
  }

  showPage('page-thankyou');
  setTimeout(createSparkles, 500);
}

// ════════════════════════════════════════
// DUPLICATE
// ════════════════════════════════════════
function showAlreadySubmitted() {
  const name = localStorage.getItem('malika_survey_name') || 'there';
  document.getElementById('duplicate-name').textContent = name;
  showPage('page-duplicate');
}

// ════════════════════════════════════════
// SPARKLES
// ════════════════════════════════════════
function createSparkles() {
  for (let i = 0; i < 28; i++) {
    const sp     = document.createElement('div');
    sp.className = 'sparkle';
    const size   = 8 + Math.random() * 18;
    sp.style.cssText = `
      left:               ${5  + Math.random() * 90}%;
      top:                ${5  + Math.random() * 90}%;
      animation-delay:    ${Math.random() * 2.5}s;
      animation-duration: ${1.5 + Math.random() * 2}s;
    `;
    sp.innerHTML = `
      <svg width="${size}" height="${size}" viewBox="0 0 20 20">
        <path d="M10 1L11.5 8.5L19 10L11.5 11.5L10 19L8.5 11.5L1 10L8.5 8.5Z"
              fill="#c8a850"/>
      </svg>`;
    document.body.appendChild(sp);
  }
}

// ════════════════════════════════════════
// BACKGROUND DECORATION
// ════════════════════════════════════════
function createBackground() {
  const petalConfigs = [
    { w:80,  h:120, color:'#c8a850', top:'8%',    left:'4%',    delay:0  },
    { w:60,  h:90,  color:'#a08040', top:'55%',   right:'3%',   delay:3  },
    { w:50,  h:75,  color:'#c8a850', bottom:'12%',left:'7%',    delay:6  },
    { w:40,  h:60,  color:'#e8c870', top:'25%',   right:'6%',   delay:2  },
  ];

  petalConfigs.forEach((p, i) => {
    const el     = document.createElement('div');
    el.className = 'petal tilt-layer';
    el.style.cssText = `
      width:${p.w}px; height:${p.h}px; background:${p.color};
      ${p.top    ? 'top:'    + p.top    + ';' : ''}
      ${p.bottom ? 'bottom:' + p.bottom + ';' : ''}
      ${p.left   ? 'left:'   + p.left   + ';' : ''}
      ${p.right  ? 'right:'  + p.right  + ';' : ''}
      animation-delay:${p.delay}s;
      animation-duration:${14 + i * 2}s;
    `;
    document.body.appendChild(el);
  });

  [
    { w:500, h:500, top:'-150px',   right:'-150px',  delay:0 },
    { w:350, h:350, bottom:'-100px',left:'-100px',   delay:3 },
  ].forEach((o, i) => {
    const el     = document.createElement('div');
    el.className = 'gold-orb tilt-layer';
    el.style.cssText = `
      width:${o.w}px; height:${o.h}px;
      ${o.top    ? 'top:'    + o.top    + ';' : ''}
      ${o.bottom ? 'bottom:' + o.bottom + ';' : ''}
      ${o.left   ? 'left:'   + o.left   + ';' : ''}
      ${o.right  ? 'right:'  + o.right  + ';' : ''}
      animation-delay:${o.delay}s;
      animation-duration:${12 + i * 3}s;
    `;
    document.body.appendChild(el);
  });

  [20, 80].forEach(pct => {
    const el     = document.createElement('div');
    el.className = 'bg-line';
    el.style.top = pct + '%';
    document.body.appendChild(el);
  });
}

// ════════════════════════════════════════
// ON LOAD
// ════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  createBackground();

  // init experience based on device
  if (isMobile) {
    initTapRipple();
    initTiltParallax();
  } else {
    initCursor();
  }

  // scroll reveal works on both
  // (runs again when survey page loads)
  addCursorHover();

  // device check
  if (localStorage.getItem('malika_survey_submitted') === 'true') {
    showAlreadySubmitted();
  }

  // enter key on name field
  document.getElementById('name-field').addEventListener('keydown', e => {
    if (e.key === 'Enter') beginSurvey();
  });

  // progress bar on textarea input
  document.getElementById('q4-moment').addEventListener('input', updateProgress);
  document.getElementById('q6-advice').addEventListener('input', updateProgress);
});
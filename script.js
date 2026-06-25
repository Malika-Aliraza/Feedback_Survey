const SHEET_URL = "https://script.google.com/macros/s/AKfycbyPabTavnJaPwDhJJPcyznwDvXBR89JMP6hMOmbSkgW3AUweobM4-rQZzicGeS5OJp9/exec";

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
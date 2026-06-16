const SHEET_URL = "https://script.google.com/macros/s/AKfycbwO6Q8_7-gvQKsLdbXUAijxSOItjcQgMRGa68uSVtZ8zIBdyOatK5fYKjpHsQVYiZZh/exec";

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
function beginSurvey() {
  const name  = document.getElementById('name-field').value.trim();
  const input = document.getElementById('name-field');

  if (!name) {
    input.focus();
    input.style.borderColor = 'rgba(220, 100, 140, 0.7)';
    setTimeout(() => input.style.borderColor = '', 1500);
    return;
  }

  document.getElementById('survey-greeting').textContent = 'Hello, ' + name + ' ✨';
  showPage('page-survey');
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
function collectAnswers() {
  const name = document.getElementById('survey-greeting')
    .textContent
    .replace('Hello, ', '')
    .replace(' ✨', '')
    .trim();

  const q1 = document.querySelector('#q1-emoji .selected')
    ?.getAttribute('data-label') || 'No answer';

  const q2 = [...document.querySelectorAll('#q2-strengths .selected')]
    .map(b => b.textContent.trim()).join(', ') || 'No answer';

  const q3 = [...document.querySelectorAll('#q3-improve .selected')]
    .map(b => b.textContent.trim()).join(', ') || 'No answer';

  const q4 = document.getElementById('q4-moment').value.trim() || 'No answer';

  const q5 = document.querySelector('#q5-nps .selected')
    ?.textContent.trim() || 'No answer';

  const q6 = document.getElementById('q6-advice').value.trim() || 'No answer';

  return { name, q1, q2, q3, q4, q5, q6 };
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
async function submitSurvey() {
  const btn         = document.querySelector('.btn-submit');
  const fingerprint = getDeviceFingerprint();

  // ── DEVICE CHECK (localStorage) ──
  if (localStorage.getItem('malika_survey_submitted') === 'true') {
    showAlreadySubmitted();
    return;
  }

  btn.textContent = 'Sending... ✨';
  btn.disabled    = true;

  const answers = collectAnswers();

  try {
    await fetch(SHEET_URL, {
      method:  'POST',
      mode:    'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:            answers.name,
        q1_performance:  answers.q1,
        q2_strengths:    answers.q2,
        q3_improvements: answers.q3,
        q4_moment:       answers.q4,
        q5_recommend:    answers.q5,
        q6_advice:       answers.q6,
        fingerprint:     fingerprint
      })
    });

    // Save both localStorage AND fingerprint
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
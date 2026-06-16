// ── SHEET URL ── (paste your Apps Script URL here later)
const SHEET_URL = "https://script.google.com/macros/s/AKfycbxFDwUI8fa7Wux90WN-UMMSAx2iXBzz-TcT9EcGwA4MkwCUMLMpMhvgZZjm7ELqNJ72/exec";

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

// ── LANDING PAGE ──
function beginSurvey() {
  const name = document.getElementById('name-field').value.trim();

  if (!name) {
    const input = document.getElementById('name-field');
    input.focus();
    input.style.borderColor = 'rgba(220, 100, 140, 0.7)';
    setTimeout(() => input.style.borderColor = '', 1500);
    return;
  }

  document.getElementById('survey-greeting').textContent = 'Hello, ' + name + ' ✨';
  showPage('page-survey');
}

// ── LIKERT BUTTONS ──
function selectLikert(btn) {
  const row = btn.closest('.likert-row');
  row.querySelectorAll('.likert-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

// ── MULTI CHOICE BUTTONS ──
function toggleChoice(btn) {
  btn.classList.toggle('selected');
}

// ── COLLECT ALL ANSWERS ──
function collectAnswers() {
  const name = document.getElementById('survey-greeting')
    .textContent
    .replace('Hello, ', '')
    .replace(' ✨', '')
    .trim();

  const q1 = document.querySelector('#q1-likert .selected')?.textContent || 'No answer';

  const q2 = [...document.querySelectorAll('#q2-strengths .selected')]
    .map(b => b.textContent.trim())
    .join(', ') || 'No answer';

  const q3 = [...document.querySelectorAll('#q3-improve .selected')]
    .map(b => b.textContent.trim())
    .join(', ') || 'No answer';

  const q4 = document.querySelector('#q4-likert .selected')?.textContent || 'No answer';

  const q5 = document.getElementById('q5-comments').value.trim() || 'No comment';

  return { name, q1, q2, q3, q4, q5 };
}

// ── SUBMIT TO GOOGLE SHEETS ──
async function submitSurvey() {

  // Disable button to prevent double submit
  const btn = document.querySelector('.btn-submit');
  btn.textContent = 'Sending... ✨';
  btn.disabled = true;

  const answers = collectAnswers();

  try {
    await fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:            answers.name,
        q1_performance:  answers.q1,
        q2_strengths:    answers.q2,
        q3_improvements: answers.q3,
        q4_recommend:    answers.q4,
        q5_comments:     answers.q5
      })
    });
  } catch (err) {
    console.error('Submission error:', err);
  }

  // Always go to thank you page
  showPage('page-thankyou');
  setTimeout(createSparkles, 400);
}

// ── SPARKLES ──
function createSparkles() {
  const colors = ['#e0a0f0', '#a0c0f8', '#a0e8d0', '#f8d090', '#f0b0c8'];

  for (let i = 0; i < 20; i++) {
    const sp = document.createElement('div');
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

// ── FLOATING PETALS (background decoration) ──
function createPetals() {
  const colors  = ['#e8a8d8', '#a8c8f0', '#a8e8d0', '#f0d0a8', '#d0b0f0'];
  const sizes   = [30, 40, 50, 60, 35];

  const positions = [
    { top: '8%',  left: '6%'  },
    { top: '10%', right: '8%' },
    { top: '50%', left: '3%'  },
    { bottom: '15%', left: '10%' },
    { bottom: '18%', right: '6%' },
  ];

  positions.forEach((pos, i) => {
    const petal = document.createElement('div');
    petal.className = 'petal';
    const size  = sizes[i];
    const color = colors[i];
    const delay = i * 2;

    petal.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      animation-delay: ${delay}s;
      ${Object.entries(pos).map(([k, v]) => `${k}:${v}`).join(';')};
    `;

    document.body.appendChild(petal);
  });
}

// ── ENTER KEY ON NAME INPUT ──
document.addEventListener('DOMContentLoaded', () => {
  createPetals();

  document.getElementById('name-field').addEventListener('keydown', e => {
    if (e.key === 'Enter') beginSurvey();
  });
});
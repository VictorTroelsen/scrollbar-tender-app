const declineBtn = document.getElementById('decline-btn');
const acceptBtn = document.getElementById('accept-btn');
const ctaButtons = document.getElementById('cta-buttons');
const escalationModal = document.getElementById('escalation-modal');
const celebrationOverlay = document.getElementById('celebration-overlay');

const FLEE_THRESHOLD = 160;
const PADDING = 16;
const MAX_STEP = 40;

let isFleeing = false;
let btnX = 0;
let btnY = 0;

function pinToFixed() {
  const rect = declineBtn.getBoundingClientRect();
  const maxX = window.innerWidth - rect.width - PADDING;
  const maxY = window.innerHeight - rect.height - PADDING;
  btnX = Math.min(Math.max(rect.left, PADDING), maxX);
  btnY = Math.min(Math.max(rect.top, PADDING), maxY);
  declineBtn.classList.add('fleeing');
  declineBtn.style.left = btnX + 'px';
  declineBtn.style.top = btnY + 'px';
  isFleeing = true;
}

window.addEventListener('mousemove', (e) => {
  const rect = declineBtn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = cx - e.clientX;
  const dy = cy - e.clientY;
  const dist = Math.hypot(dx, dy);

  if (dist >= FLEE_THRESHOLD || dist === 0) return;

  if (!isFleeing) pinToFixed();

  const strength = (FLEE_THRESHOLD - dist) / FLEE_THRESHOLD;
  const angle = Math.atan2(dy, dx);
  const step = strength * MAX_STEP;

  const maxX = window.innerWidth - rect.width - PADDING;
  const maxY = window.innerHeight - rect.height - PADDING;

  btnX = Math.min(Math.max(btnX + Math.cos(angle) * step, PADDING), maxX);
  btnY = Math.min(Math.max(btnY + Math.sin(angle) * step, PADDING), maxY);

  declineBtn.style.left = btnX + 'px';
  declineBtn.style.top = btnY + 'px';
});

const escalationSteps = [
  { text: 'Wait, are you sure you want to decline?', yes: 'Yes', no: 'No' },
  { text: 'Are you REALLY sure?? Think about the beer.', yes: 'Yes, really', no: 'No, wait' },
  { text: "Final answer?? There's no ctrl+z on this one.", yes: "I'm sure", no: 'Nevermind' },
];
let escalationStep = 0;

function showEscalation() {
  const step = escalationSteps[escalationStep];
  escalationModal.querySelector('.modal-text').textContent = step.text;
  escalationModal.querySelector('.btn-yes').textContent = step.yes;
  escalationModal.querySelector('.btn-no').textContent = step.no;
  escalationModal.classList.remove('hidden');
}

function handleEscalationResponse() {
  escalationModal.classList.add('hidden');
  escalationStep++;
  if (escalationStep < escalationSteps.length) {
    setTimeout(showEscalation, 250);
  } else {
    finishEscalation();
  }
}

function finishEscalation() {
  declineBtn.style.display = 'none';
  for (let i = 0; i < 2; i++) {
    const btn = document.createElement('button');
    btn.className = 'btn btn-accept';
    btn.textContent = 'ACCEPT';
    btn.addEventListener('click', showCelebration);
    ctaButtons.appendChild(btn);
  }
}

function showCelebration() {
  celebrationOverlay.classList.remove('hidden');
}

declineBtn.addEventListener('click', () => {
  escalationStep = 0;
  showEscalation();
});

escalationModal.querySelector('.btn-yes').addEventListener('click', handleEscalationResponse);
escalationModal.querySelector('.btn-no').addEventListener('click', handleEscalationResponse);

acceptBtn.addEventListener('click', showCelebration);

const defaultSubjects = [
  {
    name: 'Mathematics',
    topics: ['Calculus', 'Integration', 'Limits', 'Differentiation', 'Probability', 'Matrices']
  },
  {
    name: 'Physics',
    topics: ['Electricity', 'Magnetism', 'Optics', 'Modern Physics', 'Waves', 'Units']
  },
  {
    name: 'Computer Science',
    topics: ['Data Structures', 'Java', 'DBMS', 'Algorithms', 'OOP', 'Networking']
  }
];

const API_BASE_URL = 'https://ai-study-planner-2968.onrender.com';

const state = {
  subjects: defaultSubjects,
  plan: null
};

const subjectsGrid = document.getElementById('subjectsGrid');
const roadmapOutput = document.getElementById('roadmapOutput');
const resourcesOutput = document.getElementById('resourcesOutput');
const timetableOutput = document.getElementById('timetableOutput');
const revisionOutput = document.getElementById('revisionOutput');
const progressValue = document.getElementById('progressValue');
const streakValue = document.getElementById('streakValue');
const hoursValue = document.getElementById('hoursValue');
const countdownValue = document.getElementById('countdownValue');
const progressBar = document.getElementById('progressBar');
const motivationText = document.getElementById('motivationText');
const themeToggle = document.getElementById('themeToggle');
const profileForm = document.getElementById('profileForm');
const generateBtn = document.getElementById('generateBtn');
const addSubjectBtn = document.getElementById('addSubjectBtn');
const statusBox = document.getElementById('statusBox');

function showStatus(message, type = 'info') {
  statusBox.textContent = message;
  statusBox.className = `status-box ${type}`.trim();
}

function validateProfile(profile) {
  if (!profile.name || !profile.class || !profile.hours || !profile.examDate) {
    return 'Please complete the required profile fields before generating a plan.';
  }
  const hours = Number(profile.hours);
  if (!Number.isFinite(hours) || hours < 1 || hours > 12) {
    return 'Daily study hours should be between 1 and 12.';
  }
  return null;
}

function renderSubjects() {
  subjectsGrid.innerHTML = '';
  state.subjects.forEach((subject, index) => {
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.innerHTML = `
      <h4>${subject.name}</h4>
      <ul>${subject.topics.map(topic => `<li>${topic}</li>`).join('')}</ul>
      <input value="${subject.name}" data-field="name" data-index="${index}" placeholder="Subject" />
    `;
    const input = card.querySelector('input');
    input.addEventListener('input', (event) => {
      state.subjects[index].name = event.target.value.trim() || 'Subject';
      card.querySelector('h4').textContent = state.subjects[index].name;
    });
    subjectsGrid.appendChild(card);
  });
}

function renderRoadmap(plan) {
  if (!plan) {
    roadmapOutput.innerHTML = '<div class="roadmap-item">Generate a plan to view your roadmap.</div>';
    return;
  }

  const items = Object.entries(plan.roadmap).map(([subject, weeks]) => `
    <div class="roadmap-item">
      <h4>${subject}</h4>
      ${weeks.map(week => `<p><strong>Week ${week.week}</strong> — ${week.topics.join(', ')}</p>`).join('')}
    </div>
  `).join('');
  roadmapOutput.innerHTML = items;
}

function renderResources(plan) {
  if (!plan) {
    resourcesOutput.innerHTML = '<div class="resource-item">Resources will appear here after generation.</div>';
    return;
  }

  resourcesOutput.innerHTML = `
    <div class="resource-item"><h4>Videos</h4><p>${plan.resources.videos.join(', ')}</p></div>
    <div class="resource-item"><h4>Courses</h4><p>${plan.resources.courses.join(', ')}</p></div>
    <div class="resource-item"><h4>Documentation</h4><p>${plan.resources.docs.join(', ')}</p></div>
    <div class="resource-item"><h4>Practice</h4><p>${plan.resources.practice.join(', ')}</p></div>
  `;
}

function renderTimetable(plan) {
  if (!plan) {
    timetableOutput.innerHTML = '<div class="resource-item">Your timetable will appear here.</div>';
    return;
  }

  const items = plan.dailyTimetable.map((entry) => `
    <div class="resource-item"><strong>${entry.time}</strong> — ${entry.task}</div>
  `).join('');
  timetableOutput.innerHTML = `<div class="resource-item"><h4>Strategy</h4><p>${plan.strategy}</p></div>${items}`;
}

function renderRevision(plan) {
  if (!plan) {
    revisionOutput.innerHTML = '<div class="resource-item">Revision details will appear here.</div>';
    return;
  }

  const revisionItems = plan.revisionPlan.map((entry) => `<div class="resource-item"><strong>${entry.label}</strong> — ${entry.after}</div>`).join('');
  revisionOutput.innerHTML = `
    <div class="resource-item"><h4>Weakness insight</h4><p>${plan.weaknessAnalysis.weakestSubject}: ${plan.weaknessAnalysis.improvement}</p></div>
    ${revisionItems}
    <div class="resource-item"><h4>Practice suggestions</h4><p>${Object.values(plan.practiceSuggestions).flat().join(' • ')}</p></div>
  `;
}

function updateDashboard(plan) {
  const progress = Math.min(92, 30 + state.subjects.length * 10);
  const hours = Number(plan?.profile?.hours || 4);
  const examDate = plan?.profile?.examDate ? new Date(plan.profile.examDate) : null;
  const countdown = examDate ? Math.max(0, Math.ceil((examDate - new Date()) / (1000 * 60 * 60 * 24))) : Math.max(1, 42 - state.subjects.length);

  progressValue.textContent = `${progress}%`;
  streakValue.textContent = '7 days';
  hoursValue.textContent = `${hours} hrs`;
  countdownValue.textContent = `${countdown} days`;
  progressBar.style.width = `${progress}%`;
  motivationText.textContent = plan?.motivation || `You completed ${progress}% of your weekly goal. Keep going!`;
}

function toggleTheme() {
  document.body.classList.toggle('dark');
  themeToggle.textContent = document.body.classList.contains('dark') ? '☀️ Light Mode' : '🌙 Dark Mode';
}

async function generatePlan() {
  const formData = new FormData(profileForm);
  const profile = Object.fromEntries(formData.entries());
  const validationError = validateProfile(profile);

  if (validationError) {
    showStatus(validationError, 'error');
    return;
  }

  const payload = { profile, subjects: state.subjects };

  generateBtn.textContent = 'Generating...';
  generateBtn.disabled = true;
  showStatus('Generating your personalized study plan...', 'info');

  try {
    const response = await fetch(`${API_BASE_URL}/api/plans/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message || 'Generation failed');

    state.plan = result.plan;
    renderRoadmap(state.plan);
    renderResources(state.plan);
    renderTimetable(state.plan);
    renderRevision(state.plan);
    updateDashboard(state.plan);
    showStatus('Plan generated successfully. Your roadmap is ready.', 'success');
  } catch (error) {
    showStatus(error.message || 'Unable to generate the plan right now.', 'error');
  } finally {
    generateBtn.textContent = 'Generate Study Plan';
    generateBtn.disabled = false;
  }
}

addSubjectBtn.addEventListener('click', () => {
  const newSubject = { name: 'New Subject', topics: ['Topic 1', 'Topic 2'] };
  state.subjects.push(newSubject);
  renderSubjects();
  showStatus('Added a new subject. You can rename it and generate a fresh plan.', 'info');
});

generateBtn.addEventListener('click', generatePlan);
themeToggle.addEventListener('click', toggleTheme);

renderSubjects();
updateDashboard();
renderRoadmap(null);
renderResources(null);
renderTimetable(null);
renderRevision(null);
showStatus('Fill in your profile and generate a plan.', 'info');

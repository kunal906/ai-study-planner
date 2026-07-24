const express = require('express');
const router = express.Router();

const plans = [];

router.post('/generate', async (req, res) => {
  try {
    const profile = req.body.profile;
    const subjects = req.body.subjects || [];
    const hours = Number(profile.hours || 3);

    const roadmap = {};
    subjects.forEach((subject) => {
      roadmap[subject.name] = [
        { week: 1, topics: subject.topics.slice(0, 3) },
        { week: 2, topics: subject.topics.slice(3, 6) },
        { week: 3, topics: subject.topics.slice(6, 9) }
      ];
    });

    const dailyTimetable = [
      { time: '07:00 - 08:00', task: 'Core concept study' },
      { time: '08:00 - 08:15', task: 'Short break' },
      { time: '08:15 - 09:15', task: 'Practice session' },
      { time: '09:15 - 09:45', task: 'Revision block' },
      { time: '09:45 - 10:30', task: 'Mock questions' }
    ];

    const weeklySchedule = [
      { day: 'Monday', focus: 'Foundation and problem solving' },
      { day: 'Wednesday', focus: 'Weak topics and notes' },
      { day: 'Friday', focus: 'Revision + mock test' },
      { day: 'Sunday', focus: 'Weekly review and planning' }
    ];

    const monthlySchedule = [
      { week: 'Week 1', focus: 'Build basics' },
      { week: 'Week 2', focus: 'Strengthen practice' },
      { week: 'Week 3', focus: 'Revision and speed' },
      { week: 'Week 4', focus: 'Mock tests and polish' }
    ];

    const revisionPlan = [
      { label: 'Revision 1', after: 'After 1 day' },
      { label: 'Revision 2', after: 'After 3 days' },
      { label: 'Revision 3', after: 'After 7 days' },
      { label: 'Revision 4', after: 'After 15 days' },
      { label: 'Revision 5', after: 'After 30 days' }
    ];

    const resources = {
      videos: ['Abdul Bari', 'Love Babbar', 'CodeWithHarry', 'Striver A2Z'],
      courses: ['Coursera', 'edX', 'NPTEL'],
      docs: ['Official docs', 'W3Schools', 'MDN'],
      practice: ['LeetCode', 'HackerRank', 'GeeksforGeeks', 'Codeforces']
    };

    const weaknessAnalysis = {
      weakestSubject: subjects[0]?.name || 'Mathematics',
      weakestChapter: subjects[0]?.topics[0] || 'Core concepts',
      skippedTopics: ['Review gaps', 'Low-confidence topics'],
      improvement: 'Increase revision frequency and daily practice blocks.'
    };

    const practiceSuggestions = {
      easy: ['Foundational questions', 'Short exercises'],
      medium: ['Mixed-topic practice', 'Application problems'],
      hard: ['Timed challenge sets', 'Previous year patterns'],
      previousYear: ['Past paper review', 'Chapter-wise tests'],
      mockTests: ['Weekly mock assessment', 'Exam simulation']
    };

    const plan = {
      userId: req.body.userId || 'demo-user',
      profile,
      subjects,
      roadmap,
      strategy: `Use ${hours} focused hours daily and spend extra time on weaker chapters to build confidence before the exam.`,
      dailyTimetable,
      weeklySchedule,
      monthlySchedule,
      revisionPlan,
      resources,
      weaknessAnalysis,
      practiceSuggestions,
      motivation: `You are ${Math.max(1, 30 - subjects.length)} days away from exam readiness. Keep going!`
    };

    plans.unshift(plan);

    res.status(201).json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    res.json({ success: true, plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

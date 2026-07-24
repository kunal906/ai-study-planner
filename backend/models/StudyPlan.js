const mongoose = require('mongoose');

const studyPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  profile: { type: Object, required: true },
  subjects: { type: Array, required: true },
  roadmap: { type: Object, default: {} },
  dailyTimetable: { type: Array, default: [] },
  revisionPlan: { type: Array, default: [] },
  resources: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StudyPlan', studyPlanSchema);

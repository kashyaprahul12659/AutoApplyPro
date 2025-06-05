const mongoose = require('mongoose');

const AnalyzerHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  matchScore: {
    type: Number,
    required: true
  },
  matchedSkills: [String],
  missingSkills: [String],
  suggestions: [String],
  descriptionSnippet: {
    type: String,
    maxlength: 300
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AnalyzerHistory', AnalyzerHistorySchema);

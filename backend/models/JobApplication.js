const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobApplicationSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    default: ''
  },
  jdUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['interested', 'applied', 'interview', 'offer', 'rejected'],
    default: 'interested'
  },
  linkedCoverLetterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'coverletter',
    default: null
  },
  linkedAnalyzerResultId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'analyzerresult',
    default: null
  },
  notes: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: ''
  },
  lastStatusUpdate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add index on userId for faster queries
JobApplicationSchema.index({ userId: 1 });
// Add compound index on userId and status for filtered queries
JobApplicationSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('jobapplication', JobApplicationSchema);

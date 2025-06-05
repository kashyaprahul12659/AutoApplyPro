const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true
  },
  applicationUrl: {
    type: String,
    required: true
  },
  websiteName: {
    type: String
  },
  jobTitle: {
    type: String
  },
  company: {
    type: String
  },
  status: {
    type: String,
    enum: ['completed', 'partial', 'failed'],
    default: 'completed'
  },
  fieldsAutofilled: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('History', HistorySchema);

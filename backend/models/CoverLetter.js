const mongoose = require('mongoose');

const CoverLetterSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  descriptionSnippet: {
    type: String,
    required: true
  },
  letterText: {
    type: String,
    required: true
  },
  keywords: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CoverLetter', CoverLetterSchema);

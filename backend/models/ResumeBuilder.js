const mongoose = require('mongoose');

const ResumeBuilderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  blocks: [
    {
      type: {
        type: String,
        enum: ['summary', 'skills', 'experience', 'education', 'project', 'certification'],
        required: true
      },
      content: {
        type: mongoose.Schema.Types.Mixed,
        required: true
      },
      order: {
        type: Number,
        required: true
      }
    }
  ],
  isPublic: {
    type: Boolean,
    default: false
  },
  templateId: {
    type: String,
    default: 'classic' // Default template
  }
}, {
  timestamps: true
});

// Index for faster queries
ResumeBuilderSchema.index({ userId: 1 });
ResumeBuilderSchema.index({ title: 'text' });

module.exports = mongoose.model('ResumeBuilder', ResumeBuilderSchema);

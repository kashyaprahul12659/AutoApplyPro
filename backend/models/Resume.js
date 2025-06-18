const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  userId: { // Added alias for consistency
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user: { // Keep for backward compatibility
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { // Resume name/title
    type: String,
    required: true
  },
  filename: {
    type: String,
    default: ''
  },
  originalName: {
    type: String,
    default: ''
  },
  filePath: {
    type: String,
    default: ''
  },
  fileType: {
    type: String,
    default: 'generated'
  },
  fileSize: {
    type: Number,
    default: 0
  },
  // Resume content for generated resumes
  content: {
    type: String,
    default: ''
  },
  isPrimary: {
    type: Boolean,
    default: false
  },
  // Flag for custom generated resumes
  isCustomGenerated: {
    type: Boolean,
    default: false
  },
  // Reference to job application if this is a custom resume
  basedOnJobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobApplication',
    default: null
  },
  // Parsed data from resume or generated content
  parsedData: {
    name: String,
    email: String,
    phone: String,
    address: String,
    objective: String,
    summary: String,
    education: [
      {
        institution: String,
        degree: String,
        field: String,
        year: String,
        startDate: Date,
        endDate: Date
      }
    ],
    experience: [
      {
        company: String,
        role: String,
        position: String,
        duration: String,
        startDate: Date,
        endDate: Date,
        description: String,
        isHighlighted: { type: Boolean, default: false },
        relevanceScore: { type: Number, default: 0.5 }
      }
    ],
    skills: [String],
    certifications: [String],
    projects: [
      {
        name: String,
        description: String,
        technologies: [String],
        url: String
      }
    ],
    // Metadata for custom resumes
    tailoredFor: {
      jobTitle: String,
      company: String,
      jobId: mongoose.Schema.Types.ObjectId,
      generatedAt: Date
    }
  },
  // Legacy field for backward compatibility
  extractedData: {
    name: String,
    email: String,
    phone: String,
    address: String,
    education: [
      {
        institution: String,
        degree: String,
        field: String,
        startDate: Date,
        endDate: Date
      }
    ],
    experience: [
      {
        company: String,
        position: String,
        startDate: Date,
        endDate: Date,
        description: String
      }
    ],
    skills: [String]
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume', ResumeSchema);

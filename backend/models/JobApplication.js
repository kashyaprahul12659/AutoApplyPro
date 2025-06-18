const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobApplicationSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Fixed: Changed from 'user' to 'User' to match actual model name
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
  // Enhanced job details for better tracking and resume customization
  jobDescription: {
    type: String,
    default: ''
  },
  salaryRange: {
    min: { type: Number, default: null },
    max: { type: Number, default: null },
    currency: { type: String, default: 'USD' }
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'temporary', 'internship', 'freelance'],
    default: 'full-time'
  },
  workMode: {
    type: String,
    enum: ['remote', 'onsite', 'hybrid'],
    default: 'onsite'
  },
  experienceLevel: {
    type: String,
    enum: ['entry', 'junior', 'mid', 'senior', 'lead', 'executive'],
    default: 'mid'
  },
  // Skills extracted from job description
  requiredSkills: [{
    type: String
  }],
  preferredSkills: [{
    type: String
  }],
  // Job source and metadata
  jobSource: {
    type: String,
    enum: ['linkedin', 'indeed', 'glassdoor', 'company-website', 'other'],
    default: 'other'
  },
  jobId: {
    type: String, // External job ID from job boards
    default: ''
  },
  // Application tracking
  applicationDate: {
    type: Date,
    default: null
  },
  deadlineDate: {
    type: Date,
    default: null
  },
  followUpDate: {
    type: Date,
    default: null
  },
  // Contact information
  recruiterInfo: {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    linkedin: { type: String, default: '' }
  },
  // Resume customization flags
  customResumeGenerated: {
    type: Boolean,
    default: false
  },
  customResumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    default: null
  },
  // Existing fields
  linkedCoverLetterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CoverLetter', // Fixed: Changed from 'coverletter' to 'CoverLetter' to match actual model name
    default: null
  },
  linkedAnalyzerResultId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JDAnalysisResult', // Fixed: Changed from 'analyzerresult' to 'JDAnalysisResult' to match actual model name
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

module.exports = mongoose.model('JobApplication', JobApplicationSchema); // Fixed: Changed from 'jobapplication' to 'JobApplication' for consistency

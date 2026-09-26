const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
  fileUrl: { type: String, required: true },
  fileType: { type: String, enum: ['image', 'video', 'document'], default: 'image' },
  originalName: { type: String, default: '' },
  caption: { type: String, default: '' },
  uploadedAt: { type: Date, default: Date.now },
});

const timelineSchema = new mongoose.Schema({
  stage: { type: String, required: true },
  description: { type: String, required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  updaterName: { type: String, default: 'System' },
  timestamp: { type: Date, default: Date.now },
});

const problemSchema = new mongoose.Schema(
  {
    problemId: {
      type: String,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Problem title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Problem description is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'Water Management',
        'Agriculture',
        'Healthcare',
        'Education',
        'Environment',
        'Urban Infrastructure',
        'Energy',
        'Public Services',
        'Other',
      ],
      required: [true, 'Category is required'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    submitterName: {
      type: String,
      default: 'Citizen',
    },
    location: {
      district: { type: String, required: true, index: true },
      block: { type: String, required: true },
      panchayat: { type: String, default: '' },
      village: { type: String, default: '' },
      coordinates: {
        latitude: { type: Number, default: null },
        longitude: { type: Number, default: null },
      },
    },
    evidence: [evidenceSchema],
    impact: {
      estimatedPopulation: { type: Number, default: 0 },
      frequency: {
        type: String,
        enum: ['Daily', 'Weekly', 'Seasonal', 'Occasionally', 'Unknown'],
        default: 'Daily',
      },
      citizenReportedSeverity: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium',
      },
    },
    status: {
      type: String,
      enum: [
        'SUBMITTED',
        'AI_CLASSIFIED',
        'PRI_VERIFICATION_PENDING',
        'PRI_VERIFIED',
        'REJECTED',
        'NODAL_REVIEWED',
        'MASTER_PROBLEM_CREATED',
      ],
      default: 'SUBMITTED',
      index: true,
    },
    assignedTo: {
      type: String,
      default: 'Local PRI / ULB Verification Pending',
    },
    priVerification: {
      verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
      verifierName: { type: String, default: '' },
      verifiedAt: { type: Date, default: null },
      isGenuine: { type: Boolean, default: null },
      observedPopulation: { type: Number, default: null },
      groundCondition: { type: String, default: '' },
      baselineData: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
      remarks: { type: String, default: '' },
    },
    nodalReview: {
      reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
      reviewerName: { type: String, default: '' },
      nodalOrgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', default: null },
      reviewedAt: { type: Date, default: null },
      confirmedDomain: { type: String, default: '' },
      confirmedSeverity: { type: String, default: '' },
      action: {
        type: String,
        enum: ['ACCEPTED', 'REJECTED', 'CONVERTED_TO_MASTER', null],
        default: null,
      },
      masterProblemId: { type: String, default: '' },
      remarks: { type: String, default: '' },
    },
    timeline: [timelineSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Problem', problemSchema);

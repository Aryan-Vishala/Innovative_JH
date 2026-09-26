const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: [
        'pri_panchayat',
        'ulb_municipality',
        'nodal_hei',
        'participating_hei',
        'industry',
        'government_dept',
      ],
      required: [true, 'Organization type is required'],
    },
    code: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
    },
    district: {
      type: String,
      required: [true, 'District is required'],
    },
    block: {
      type: String,
      default: '',
    },
    domains: {
      type: [String],
      default: [], // e.g. ['Water Management', 'Agriculture']
    },
    verified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Organization', organizationSchema);

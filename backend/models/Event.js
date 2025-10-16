const mongoose = require('mongoose');

const updateLogSchema = new mongoose.Schema({
  updatedAt: {
    type: Date,
    default: Date.now
  },
  changes: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
});

const eventSchema = new mongoose.Schema({
  profiles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  }],
  timezone: {
    type: String,
    required: true
  },
  startDateTime: {
    type: Date,
    required: true
  },
  endDateTime: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  updateLogs: [updateLogSchema]
});

// Validation: End date must be after start date
eventSchema.pre('save', function(next) {
  if (this.endDateTime <= this.startDateTime) {
    next(new Error('End date/time must be after start date/time'));
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);

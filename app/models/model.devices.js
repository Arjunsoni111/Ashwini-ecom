var mongoose = require('mongoose'),
  timestamps = require('mongoose-timestamp'),
  Schema = mongoose.Schema;

var appUserDeviceSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  deviceId: {
    type: String,
    required: true
  },
  deviceToken: {
    type: String,
    trim: true
  },
  os: {
    type: String,
    trim: true
  },
  osVersion: {
    type: String,
    trim: true
  },
  platform: {
    type: String,
    trim: true
  },
  make: {
    type: String,
    trim: true
  },
  model: {
    type: String,
    trim: true
  },
  manufacturer: {
    type: String,
    trim: true
  },
  screenWidth: {
    type: String,
    trim: true
  },
  screenHeight: {
    type: String,
    trim: true
  },
  ipAddress: {
    type: String,
    trim: true
  },
  isActive: {
    type: Number,
    required: true,
    default: 1
  },
  isDeleted: {
    type: Number,
    required: true,
    default: 0
  },

});


appUserDeviceSchema.plugin(timestamps, {
  createdAt: 'dateCreated',
  updatedAt: 'dateUpdated'
});

module.exports = mongoose.model('appUserDevices', appUserDeviceSchema, 'appUserDevices');

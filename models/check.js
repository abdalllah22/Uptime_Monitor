const mongoose = require('mongoose');
const validator = require('validator');

const checkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
  protocol: {
    type: String,
    enum: ['HTTP', 'HTTPS', 'TCP'],
    required: true,
  },
  path: {
    type: String,
    trim: true,
  },
  port: {
    type: Number,
  },
  webhook: {
    type: String,
    trim: true,
  },
  timeout: {
    type: Number,
    default: 5, // in seconds
  },
  interval: {
    type: Number,
    default: 10, // in minutes
  },
  threshold: {
    type: Number,
    default: 1,
  },
  authentication: {
    type: String,
    trim: true,
  },
  httpHeaders: [{
    type: String,
  }],
  assert: {
    type: Number,
  },
  tags: {
    type: String,
    trim: true,
  },
  ignoreSSL: {
    type: Boolean,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, {
  timestamps: true,
});

const Check = mongoose.model('Check', checkSchema);

module.exports = Check;

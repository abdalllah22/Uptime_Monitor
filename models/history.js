const mongoose = require('mongoose');
const validator = require('validator');

const historySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['up', 'down'],
  },
  check_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Check',
  },
}, {
  timestamps: true,
});

const History = mongoose.model('History', historySchema);

module.exports = History;

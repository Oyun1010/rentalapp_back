const mongoose = require('mongoose');

const Notification = mongoose.model('notification', new mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId},
    message: { type: String },
    currentDate: { type: Date, default: Date.now }
}));

module.exports = Notification;
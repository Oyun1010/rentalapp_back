const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Messages = mongoose.model("Messages", new mongoose.Schema({
    ownerId: { type: Schema.Types.ObjectId, ref: 'owner' },
    renterId: { type: Schema.Types.ObjectId, ref: 'renter' },
    dateTime: { type: Date, default: Date.now },
    message: { type: Array },
}));

module.exports = Messages;
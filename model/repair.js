const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Repair = mongoose.model("repair", new mongoose.Schema({
    booking_id: { type: Schema.Types.ObjectId, ref: 'bookings' },
    renter_id: { type: Schema.Types.ObjectId, ref: 'renters' },
    owner_id: { type: Schema.Types.ObjectId, ref: 'owners' },
    dateTime: { type: Date, default: Date.now },
    status: { type: String, default: 'Хүлээгдэж буй' },
    desc: { type: String }

}));

module.exports = Repair;
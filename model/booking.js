const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Booking = mongoose.model("booking", new mongoose.Schema({
    renterId: { type: Schema.Types.ObjectId, ref: 'renters' },
    equipmentId: { type: Schema.Types.ObjectId, ref: 'equipment' },
    currentDate: { type: Date, default: Date.now },
    startDate: { type: Date },
    endDate: { type: Date },
    total: { type: Number },
    quantity: { type: Number },
    status: { type: String, default: "Хүлээгдэж буй" },
    isReceived: { type: Boolean, default: false },
    delivery: new mongoose.Schema({
        bookingId: { type: Schema.Types.ObjectId },
        option: { type: String },
        address: { type: String }
    })
}));

module.exports = Booking;
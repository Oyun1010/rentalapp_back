const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Rent = mongoose.model("Rent", new mongoose.Schema({
    renterId: { type: Schema.Types.ObjectId, ref: 'renter' },
    equipmentId: { type: Schema.Types.ObjectId, ref: 'equipment' },
    rentStart: { type: Date, default: Date.now },
    rentEnd: { type: Date, default: Date.now },
    dateTime: { type: Date, default: Date.now },
    status: { type: String },
    total: { type: Number },
}));
module.exports = Rent; 
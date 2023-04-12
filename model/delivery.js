const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Delivery = mongoose.model("delivery", new mongoose.Schema({
    bookingId: { type: Schema.Types.ObjectId },
    option: { type: String },
    address: { type: String }
}));

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Repair = mongoose.model("repair", new mongoose.Schema({
    rentalId: {type: Schema.Types.ObjectId, ref: 'rental'},
    dateTime: {type: Date, default: Date.now},
    desc: {type: String}

}));

module.exports = Repair;
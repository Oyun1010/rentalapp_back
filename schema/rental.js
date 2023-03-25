const mongoose = require('mongoose');

const Rented = mongoose.model("Rented", new mongoose.Schema({
    customerId : {type: String},
    equipmentId: {type:String},
    rentStart: {type: Date, default: Date.now()},
    rentEnd: {type: Date, default: Date.now()},
    dateTime: {type: Date, default: Date.now()},
    status: {type: String},
    total: {type: Number},
}));
module.exports = Rented; 
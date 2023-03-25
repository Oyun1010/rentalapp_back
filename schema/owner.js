const mongoose = require('mongoose');

const Owner = mongoose.model("owners", new mongoose.Schema({
    ownerName: { type: String },
    password: { type: String },
    email: { type: String },
    phone: { type: String, unique: true },
    location: new mongoose.Schema({
        lat: { type: Number },
        long: { type: Number },
        fullAddress: { type: String }
    }),
    accountNumber: { type: String },
    rate: { type: Number, default: 0 }


}));

module.exports = Owner;
const mongoose = require('mongoose');

const Renter = mongoose.model("Renters", new mongoose.Schema({
    lastName: { type: String },
    firstName: { type: String },
    password: { type: String },
    phone: { type: String, unique: true },
    gender: { type: String },
    dob: { type: Date },
    profilePic: { type: String, default: "https://i.pinimg.com/originals/fd/af/12/fdaf129c3310e638533e10a8dc229955.jpg" },
    address: new mongoose.Schema({
        city: { type: String, default: null },
        district: { type: String, default: null },
        committee: { type: String, default: null },
        fullAddress: { type: String, default: null },
    }),
}));
module.exports = Renter;
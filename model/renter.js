const mongoose = require('mongoose');

const Renter = mongoose.model("Renters", new mongoose.Schema({
    lastName: { type: String },
    firstName: {type: String},
    password: { type: String },
    phone: { type: String, unique: true },
    gender: {type: String},
    dob: {type: Date},
    profilePic: { type: String, default: "https://i.pinimg.com/originals/fd/af/12/fdaf129c3310e638533e10a8dc229955.jpg" },
    address: new mongoose.Schema({
        city: { type: String },
        district: { type: String },
        committee: { type: String },
        fullAddress: { type: String },
    }),
}));
module.exports = Renter;
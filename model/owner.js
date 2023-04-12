const mongoose = require('mongoose');

const Owner = mongoose.model("owners", new mongoose.Schema({
    name: { type: String },
    password: { type: String },
    email: { type: String },
    phone: { type: String, unique: true },
    profilePic: { type: String, default: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg" },
    address: new mongoose.Schema({
        city: { type: String },
        district: { type: String },
        committee: { type: String },
        fullAddress: { type: String },
    }),
    accountNumber: { type: String },
    rate: { type: Number, default: 0 }
}));

module.exports = Owner;
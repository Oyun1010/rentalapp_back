const mongoose = require('mongoose');

const Owner = mongoose.model("owners", new mongoose.Schema({
    name: { type: String },
    password: { type: String },
    email: { type: String },
    phone: { type: String, unique: true },
    profilePic: { type: String, default: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg" },
    address: new mongoose.Schema({
        city: { type: String, default: null },
        district: { type: String, default: null },
        committee: { type: String, default: null },
        fullAddress: { type: String, default: null },
    }),
    bankAccount: new mongoose.Schema({
        accountName: { type: String, default: null },
        bankName: { type: String, default: null },
        accountNumber: { type: String, default: null },
        qpay: { type: String, default: null }
    }),
    rating: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'rating' }],
        default: []
    }
}));

module.exports = Owner;
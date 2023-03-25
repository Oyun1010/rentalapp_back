const mongoose = require('mongoose');

const Customer = mongoose.model("Customers", new mongoose.Schema({
    lastName: { type: String },
    password: { type: String },
    phone: { type: String, unique: true },
    location: new mongoose.Schema({
        lat: { type: Number, default: 0.0 },
        long: { type: Number, default: 0.0 },
        fullAddress: { type: String, default: "" }
    }),
}));
module.exports = Customer;
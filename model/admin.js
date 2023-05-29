const mongoose = require('mongoose');

const Admin = mongoose.model("admin", new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    userName: {type: String},
    phone: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String },
}));

module.exports = Admin;
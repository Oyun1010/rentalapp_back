const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    _id: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String, unique: true },
    profilePic: { type: String },
    dob: { type: Date},
    gender: { type: String },
    password: {type: String},
    location: new mongoose.Schema({
        lat: { type:Number, default: 0.0},
        long: { type: Number, default: 0.0},
        fullAddress: {type:String, default: ""}
    }),
})
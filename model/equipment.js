const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Equipment = mongoose.model("equipment", new mongoose.Schema({
    ownerId: { type: Schema.Types.ObjectId, ref: 'owner' },
    images: { type: Array },
    name: { type: String },
    brand: { type: String, default: null },
    model: { type: String, default: null },
    desc: { type: String },
    key: { type: String },
    year: { type: Number, default: null },
    quantity: { type: Number, default: 1 },
    price: { type: Number },
    availabilityPeriod: { type: Date },
    category: { type: String, default: '' },
    details: {type: Object},
    location: new mongoose.Schema({
        lat: { type: Number },
        long: { type: Number},
        fullAddress: { type: String }
    }),
    delivery: new mongoose.Schema({
        price: { type: Number },
        desc: { type: String }
    })
}));
module.exports = Equipment;
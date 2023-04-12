const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Equipment = mongoose.model("equipment", new mongoose.Schema({
    ownerId: { type: Schema.Types.ObjectId, ref: 'owner' },
    images: { type: Array },
    name: { type: String },
    brand: { type: String },
    model: { type: String },
    desc: { type: String },
    key: { type: String },
    year: { type: Number },
    quantity: { type: Number },
    price: { type: Number },
    availabilityPeriod: { type: Date },
    catergory: { type: String },
    location: new mongoose.Schema({
        lat: { type: Number, default: 0.0 },
        long: { type: Number, default: 0.0 },
        fullAddress: { type: String, default: "" }
    }),
    delivery: {type: String}
}));
module.exports = Equipment;
const mongoose = require('mongoose');

const Location = mongoose.model("Locations", new mongoose.Schema({
    equip_id: {type: String},
    lat: {type: Number},
    long: {type: Number},
    fullAddress: {type: Number},
}));

module.exports = Location;
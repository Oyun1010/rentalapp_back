const mongoose = require('mongoose');

const Details = mongoose.model("details", new mongoose.Schema({
    category: {type: String},
    details: {type: Array, default: []}

}));

module.exports = Details;
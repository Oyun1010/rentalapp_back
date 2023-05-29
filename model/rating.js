const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Rating = mongoose.model("rating", new mongoose.Schema({
    renterId: { type: Schema.Types.ObjectId, ref: 'renters' },
    ownerId: { type: Schema.Types.ObjectId, ref: 'owners' },
    rating: { type: Number, default: 0.0 }
}));

module.exports = Rating;
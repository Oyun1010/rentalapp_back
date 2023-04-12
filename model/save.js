const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Saved = mongoose.model("saved", new mongoose.Schema({
    equipments: {type: Array},
    renterId: {type: Schema.Types.ObjectId},
}))
module.exports= Saved;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Messages = mongoose.model("Messages", new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, require: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, require: true },
    message: { type: String, require: true },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
},));

module.exports = Messages;
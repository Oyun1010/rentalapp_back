const mongoose = require('mongoose');

const Chat = mongoose.model("Chat", new mongoose.Schema({
    members: {type: Array,},
}));

module.exports = Chat;
const mongoose = require('mongoose');

const Messages = mongoose.model("Messages", new mongoose.model({
    ownerId: {type: String},
    customerId: {type: String},
    currentDate: {type :Date},
    message: {type: Array},
}));

model.export = Messages;
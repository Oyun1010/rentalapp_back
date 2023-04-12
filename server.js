require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();
const ipAddress = "192.168.0.101";


app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

const mainRouters = require('./routes');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.info("Connected to the Database");
    })
    .catch((e) => {
        console.log("Error: ", e);
    });

mainRouters(app);

var server = app.listen(5000, ipAddress, function () {
    var port = server.address().port;
    console.log('Listening at ' + ipAddress + ":" + port);
});
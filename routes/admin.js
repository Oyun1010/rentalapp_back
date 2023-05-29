const express = require("express");
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Admin = require("../model/admin");
const Renter = require("../model/renter");
const Owner = require("../model/owner");
const Booking = require("../model/booking");
const Rating = require("../model/rating");
const auth = require("../middleware/auth");
const { default: mongoose } = require("mongoose");

router.post("/register", async (req, res) => {
    console.log("body" + req.body);
    try {
        const { lastName, firstName, password, phone, email } = req.body;

        encryptedPassword = await bcrypt.hash(password, 10);
        const admin = await Admin.create({
            lastName: lastName,
            firstName: firstName,
            password: encryptedPassword,
            phone: phone,
            email: email,
        });
        const token = jwt.sign(
            { id: admin._id },
            process.env.TOKEN_SECRET, {
            expiresIn: "2h",
        }
        );
        admin.token = token;
        res.status(200).send({
            token: token,
            data: admin
        });
    }
    catch (err) {
        console.log(err);
    }
});

router.post("/login", async (req, res) => {

    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email: email });
        if (admin && (await bcrypt.compare(password, admin.password))) {

            const token = jwt.sign(
                { id: admin._id },
                process.env.TOKEN_SECRET,
                { expiresIn: "5h" }
            );
            admin.token = token;
            res.status(200).send({
                token: token,
                data: admin
            });
        }
        else res.status(400).send("The username or password is incorrect");
    }
    catch (err) {
        console.log(err);
    }
});

router.get('/getOwners', async (req, res) => {
    await Owner.find({})
        .then((data) => res.status(200).send(data))
        .catch((error) => console.log(error));
});

router.get('/getRenters', async (req, res) => {
    await Renter.find({})
        .then((data) => res.status(200).send(data))
        .catch((err) => console.log(err));
});

router.get('/getBooking', async (req, res) => {
    await Booking.aggregate([
        {
            $lookup: {
                from: 'equipment',
                localField: "equipmentId",
                foreignField: "_id",
                as: "equipment"
            }
        },
        {
            $unwind: '$equipment'
        },
        {
            $lookup: {
                from: 'renters',
                localField: 'renterId',
                foreignField: '_id',
                as: 'renter'
            }
        },
        {
            $unwind: '$renter'
        }
    ])
        .sort({ _id: -1 })
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((error) => console.log(error));
})

module.exports = router;
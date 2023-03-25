const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');

require('dotenv').config();

const Owner = require('../schema/owner');

router.post("/login", async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (!(phone && password)) {
            res.status(400).send("All input is required");
        }
        const owner = await Owner.findOne({ phone: phone });
        if (owner && (await bcrypt.compare(password, owner.password))) {

            const token = jwt.sign(
                { id: owner._id },
                process.env.TOKEN_KEY,
                { expiresIn: "5h" }
            );
            owner.token = token;
            res.status(200).send({
                token: token,
                data: owner
            });
        }
        else res.status(400).send("The username or password is incorrect");
    }
    catch (err) {
        console.log(err);
    }
});
router.post("/register", async (req, res) => {
    console.log("body" + req.body);
    try {
        const { ownerName, password, email, phone, address } = req.body;
        const oldUser = await Owner.findOne({ phone: phone });
        if (oldUser) {
            return res.status(409).send("User Already Exist.");
        }
        encryptedPassword = await bcrypt.hash(password, 10);
        const owner = await Owner.create({
            ownerName: ownerName,
            password: encryptedPassword,
            email: email,
            phone: phone,
            address: address,

        });
        const token = jwt.sign(
            { id: owner._id },
            process.env.TOKEN_KEY, {
            expiresIn: "2h",
        }
        );
        owner.token = token;
        res.status(200).send({
            token: token,
            data: owner
        });
    }
    catch (err) {
        console.log(err);
    }
});



router.get("/all", async (req, res) => {
    await Owner.find({}).then((data) => {
        res.status(200).send(data);
    }).catch((err) => {
        res.status(500).send(err);
    });
});





module.exports = router;
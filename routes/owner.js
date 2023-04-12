const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');

require('dotenv').config();

const Owner = require('../model/owner');
const Equipment = require('../model/equipment');

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
                process.env.TOKEN_SECRET,
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
        const { name, password, email, phone, address } = req.body;
        const oldUser = await Owner.findOne({ phone: phone });
        if (oldUser) {
            return res.status(409).send("User Already Exist.");
        }
        encryptedPassword = await bcrypt.hash(password, 10);
        const owner = await Owner.create({
            name: name,
            password: encryptedPassword,
            email: email,
            phone: phone,
            address: address,
        });
        const token = jwt.sign(
            { id: owner._id },
            process.env.TOKEN_SECRET, {
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

router.get('/:id', async (req, res) => {
    const id = req.params.id;

    await Owner.findOne({ _id: id })
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((error) => {
            console.log(error);
        })
})


router.get("/equipments/:id", async (req, res) => {
    const id = req.params.id;
    await Equipment.find({ ownerId: id }).then((data) => {
        res.status(200).send(data);
    }).catch((err) => {
        res.status(500).send(err);
    });
});
router.post("/createEquipment", async (req, res) => {
    try {
        await Equipment.create(req.body);
        res.status(200).send("ok");
    }
    catch (err) {
        console.log(err);

    }
});

module.exports = router;
const express = require("express");
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Admin = require("../model/admin");

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
            renter.token = token;
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

module.exports = router;
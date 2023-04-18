const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');

require('dotenv').config();

const Owner = require('../model/owner');
const Equipment = require('../model/equipment');
const Booking = require('../model/booking');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

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

router.get("/info", auth, async (req, res) => {
    await Owner.findById(req.user_id)
        .then((data) => res.status(200).send(data))
        .catch((error) => console.log(error));
})

router.post('/updateInfo', auth, async (req, res) => {
    const { name, email, phone } = req.body;
    await Owner.findByIdAndUpdate(req.user_id, {
        name: name,
        email: email

    });
    res.status(200).send("success");
});
router.post('/updateAddress', auth, async (req, res) => {
    const { city, district, committee, fullAddress } = req.body;
    await Owner.findByIdAndUpdate(req.user_id, {
        city: city,
        district: district,
        committee: committee,
        fullAddress: fullAddress,
    });
    res.status(200).send("succ");
});
router.post('updateBanckAccount', auth, async (req, res) => {
    const { accountName, bankName, accoundNumber, qpay } = req.body;
    await Owner.findByIdAndUpdate(req.user_id, {
        accountName: accountName,
        bankName: bankName,
        accoundNumber: accoundNumber,
        qpay: qpay,
    });
    res.status(200).send("succ");
})

router.get("/deleteAccount", auth, async (req, res) => {
    await Owner.findByIdAndDelete(req.user_id);
    res.status(200).send("success");
})

router.post("/createEquipment", auth, async (req, res) => {
    const { images, name, model, brand, desc, key, year, quantity, price, availabilityPeriod, catergory, lat, long, fullAddress } = req.body;
    try {
        await Equipment.create({
            ownerId: req.user_id,
            images: images,
            name: name,
            model: model,
            brand: brand,
            desc: desc,
            key: key,
            year: year,
            quantity: quantity,
            price: price,
            availabilityPeriod: availabilityPeriod,
            catergory: catergory,
            location: {
                lat: lat,
                long: long,
                fullAddress: fullAddress
            }
        });
        res.status(200).send("ok");
    }
    catch (err) {
        console.log(err);

    }
});

router.post("/updateEquipment/:id", auth, async (req, res) => {
    console.log("+" + req.params.id);
    await Equipment.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).send("success");
})

router.post("/confirm", auth, async (req, res) => {
    await Booking.findByIdAndUpdate(req.body.bookingId, {
        status: "Баталгаажсан"
    })
    res.status(200).send("success");
})

router.post("/cancel", auth, async (req, res) => {
    await Booking.findByIdAndUpdate(req.body.bookingId, {
        status: "Цуцлагдсан"
    });
});

router.get('/booking', auth, async (req, res) => {


    // await Equipment.aggregate([
    //     {
    //         $match: {
    //           ownerId: new mongoose.Types.ObjectId(req.user_id)
    //         }
    //     },
    //     {
    //         $lookup: {
    //           from: 'booking',
    //           localField: 'equipmentId',
    //           foreignField: 'equipmentId',
    //           let: {
    //             bookingEquipmentId : "$equipmentId",
    //           },
    //           pipeline: [ {
    //             $match: {
    //                $expr: { $in: [ "$$bookingEquipmentId", "$equipmentId" ] }
    //             }
    //          } ],
    //           as: 'booking'
    //         }
    //     },

    // ])
    await Booking.aggregate([
        {
            $lookup: {
                from: 'equipment',
                localField: 'equipmentId',
                foreignField: '_id',
                pipeline: [{
                    $match: {
                        ownerId: new mongoose.Types.ObjectId(req.user_id)
                    }
                }],
                as: 'equipment'
            },

        },
        {
            $unwind: '$equipment'
        }
    ])
        .then((data) => {
            console.log('data ' + data[0].equipment);
            res.status(200).send(data);
        })
        .catch((error) => {
            console.log(error);
        })


});


module.exports = router;
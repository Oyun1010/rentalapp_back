const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');

require('dotenv').config();

const Owner = require('../model/owner');
const Equipment = require('../model/equipment');
const Booking = require('../model/booking');
const Rating = require('../model/rating');
const Repair = require('../model/repair');
const Notification = require('../model/notification');
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
                { expiresIn: "7d" }
            );
            console.log("OWNER:", owner);
            return res.status(200).send({
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
            expiresIn: "7d",
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
    console.log("---------------------------------------")
    const { images, name, model, brand, desc, key, year, quantity, price, availabilityPeriod, catergory, details, lat, long, fullAddress } = req.body;
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
            details: details,
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

    const { bookingId, recipient, equipment_name } = req.body;

    await Booking.findByIdAndUpdate(bookingId, {
        status: "Баталгаажсан"
    });
    await Notification.create({
        repicent: recipient,
        message: equipment_name + "захиалга амжилттай баталгаажлаа."
    })
    res.status(200).send("success");
})


router.post("/received", auth, async (req, res) => {
    const { bookingId, isReceived } = req.body;
    await Booking.findByIdAndUpdate(bookingId, {
        isReceived: isReceived
    });
})

router.get('/notification', auth, async (req, res) => {
    await Notification.find({ recipient: req.user_id })
        .then((data) => res.status(200).send(data))
        .catch((e) => console.log(e));
})

router.post("/cancel", auth, async (req, res) => {

    const { bookingId, recipient, equipment_name } = req.body;

    await Booking.findByIdAndUpdate(bookingId, {
        status: "Цуцлагдсан"
    });
    await Notification.create({
        recipient: recipient,
        message: equipment_name + "захиалга цуцлагдлаа."
    })
});

router.get('/booking', auth, async (req, res) => {
    console.log("hhhhhhhhhhhhhhhhhhhh")
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
            $lookup: {
                from: 'renters',
                localField: 'renterId',
                foreignField: '_id',
                as: 'renter'
            }
        },
        {
            $unwind: '$equipment'
        },
        {
            $unwind: '$renter'
        },
        { $sort: { currentDate: -1 } }
    ])
        .then((data) => {

            res.status(200).send(data);
        })
        .catch((error) => {
            console.log(error);
        })


});

router.get('/getRating', auth, async (req, res) => {
    let rating = 0.0;
    try {
        const data = await Rating.find({
            ownerId: req.user_id,
        });
        data.map((e) => {
            return rating += (e.rating.toFixed(2) / data.length);
        })


        res.status(200).send({ rate: rating })
    } catch (error) {

    }

});

router.get('/getRepair', auth, async (req, res) => {
    await Repair.aggregate([
        {
            $match: {
                owner_id: new mongoose.Types.ObjectId(req.user_id)
            }
        },
        {
            $lookup: {
                from: 'bookings',
                localField: 'booking_id',
                foreignField: '_id',
                as: 'booking',
            }
        },
        {
            $unwind: '$booking',
        },
        {
            $lookup: {
                from: 'equipment',
                localField: 'booking.equipmentId',
                foreignField: '_id',
                as: 'equipment'
            }
        },
        {
            $unwind: '$equipment',
        },
    ])
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => console.log(err));
})

router.post("/sendNotif", auth, async (req, res) => {

})

router.post('/uploadImage', auth, async (req, res, next) => {
    const equip = await Equipment.findById(req.params.id);
    if (!equip) {

    }
    const file = req.files.file;
    //file type check
    if (!file.mimetype.startsWith("image")) {

    }
    if (file.size > process.env.IMAGE_SIZE) {

    }
    file.name = "photo_" + req.params.id + path.parse(file.name).ext;
    file.mv(`${process.env.PHOTO_FOLDER_PATH}/${file.name}`, (err) => {
        if (err) {
            console.log(err);
        }
    });
    equip.photo = file.name;
    // book.UpdateUserId = req.user;
    // book.save();
    return res.status(200).json({
        success: true,
        photo: file.name,
    });
});

module.exports = router;
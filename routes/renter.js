const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

require('dotenv').config();

const auth = require('../middleware/auth');
const Rent = require('../model/rent');
const Renter = require('../model/renter');
const Saved = require('../model/save');
const Equipment = require('../model/equipment');
const Booking = require('../model/booking');
const Repair = require('../model/repair');
const Rating = require('../model/rating');
const Notification = require('../model/notification');

router.post("/login", async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (!(phone && password)) {
            res.status(400).send("All input is required");
        }
        const renter = await Renter.findOne({ phone: phone });
        if (renter && (await bcrypt.compare(password, renter.password))) {

            const token = jwt.sign(
                { id: renter._id },
                process.env.TOKEN_SECRET,
                { expiresIn: "7d" }
            );

            return res.status(200).send({
                token: token,
                data: renter
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
        const { lastName, firstName, password, phone, gender, dob, address } = req.body;
        const oldUser = await Renter.findOne({ phone: phone });
        if (oldUser) {
            return res.status(409).send("User Already Exist.");
        }
        encryptedPassword = await bcrypt.hash(password, 10);
        const renter = await Renter.create({
            lastName: lastName,
            firstName: firstName,
            password: encryptedPassword,
            phone: phone,
            gender: gender,
            dob: dob,
            address: address,
        });
        const token = jwt.sign(
            { id: renter._id.toString() },
            process.env.TOKEN_SECRET, {
            expiresIn: "7d",
        }
        );

        res.status(200).send({
            token: token,
            data: renter
        });
    }
    catch (err) {
        console.log(err);
    }
});

router.get("/info", auth, async (req, res) => {
    await Renter.findById(req.user_id)
        .then((data) => res.status(200).send(data))
        .catch((error) => console.log(error));
})

router.get("/saved", auth, async (req, res) => {

    await Saved.findOne({ renterId: req.user_id }).then((data) => {
        return res.status(200).json(data);
    }).catch((error) => console.log(error));
    return;
});

router.post('/addSaved', auth, async (req, res) => {
    try {
        const { equipmentId } = req.body;
        const renter = await Saved.findOne({ renterId: req.user_id });
        console.log("JJJJJJJJJJ : " + req.user_id);
        if (!renter) {
            await Saved.create({
                renterId: req.user_id,
                equipments:
                    equipmentId

            }).then((data) => res.status(200).send(data));
        }
        else {
            let saved = await Saved.findOne({
                equipments: {
                    $elemMatch: {
                        equipmentId: equipmentId
                    }
                }
            });
            if (!saved) {
                await Saved.findOneAndUpdate({ renterId: req.user_id },
                    {
                        $push: { equipments: equipmentId }
                    }
                ).then(() => res.status(200).send("success"))
                    .catch((error) => console.log(error));
            }
            else res.status(200).send("");

        }

    } catch (error) {
        console.log(error);
    }
});

router.get('/deleteSaved/:equipmentId', auth, async (req, res) => {
    try {
        await Saved.findOneAndUpdate(
            { renterId: req.user_id },
            {
                $pull: { equipments: req.params.equipmentId }
            }
        );
        res.status(200).send("success");

    } catch (error) {
        console.log(error);

    }
});



router.get('/savedEquip/:id', async (req, res) => {
    const equipmentId = req.params.id;

    await Equipment.findOne({ _id: equipmentId })
        .then((data) => res.status(200).json(data))
        .catch((error) => console.log(error));

})

router.post('/update', auth, async (req, res) => {
    const { id, firstName, lastName, phone, password, gender, dob } = req.body;
    await Renter.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                lastName: lastName,
                firstName: firstName,
                password: password,
                phone: phone,
                gender: gender,
                dob: dob
            }
        }, { new: true }, (err, data) => {
            if (data == null) {
                res.status(200).send("nothing found");
            }
            else res.status(200).send(data);
        });
});

router.get('/deleteAccount', auth, async (req, res) => {
    await Renter.findByIdAndDelete(req.user_id)
        .then(() => res.status(200).send("success"));
})

router.post('/createBooking', auth, async (req, res) => {

    const { equipmentId, currentDate, startDate, endDate, quantity, total, delivery, recipient, equipment_name } = req.body;

    await Booking.create({
        renterId: req.user_id,
        equipmentId: equipmentId,
        currentDate: currentDate,
        startDate: startDate,
        endDate: endDate,
        quantity: quantity,
        total: total,
        delivery: delivery,
    })
        .then((data) => res.status(200).json(data))
        .catch((error) => console.log(error));

    await Notification.create({
        recipient: recipient,
        message: equipment_name + " захиалгын хүсэлт илгээгдлээ."
    })
});

router.post('/deleteBooking', auth, async (req, res) => {
    console.log("delete");

    const { recipient, equipment_name } = req.body;
    await Booking.findByIdAndDelete(req.body.id);
    res.status(200).send("success");
    await Notification.create({
        recipient: recipient,
        message: equipment_name + "захиалгыг цуцлагдлаа."
    })

});

router.get('/getBooking', auth, async (req, res) => {
    // await Booking.find({ renterId: req.user_id }).
    //     then((data) => { res.status(200).send(data) })
    //     .catch((error) => console.log(error));
    await Booking.aggregate([
        {
            $match:
                { renterId: new mongoose.Types.ObjectId(req.user_id) }
        },
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
    ]).sort({ _id: -1 })
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((error) => console.log(error));
});


router.post('/createRepair', auth, async (req, res) => {
    const { owner_id, booking_id, desc } = req.body;
    console.log(req.body);
    await Repair.create({
        booking_id: booking_id,
        renter_id: req.user_id,
        owner_id: owner_id,
        desc: desc
    })
        .then((data) => res.status(200).send(data))
        .catch((error) => console(error));
});

router.get('/getRepair', auth, async (req, res) => {
    // await Repair.aggregate([
    //     {
    //         $match:
    //             { renter_id: new mongoose.Types.ObjectId(req.user_id) }
    //     },
    //     {
    //         $lookup: {
    //           from: 'equipment',
    //           localField: '',
    //           foreignField: field,
    //           as: result
    //         }
    //     }
    // ])

    await Repair.find({ renter_id: req.user_id })
        .then((data) => res.status(200).send(data))
        .catch((error) => console(error));
});

router.post('/getRating', auth, async (req, res) => {
    const { owner_id } = req.body;
    let rating = 0.0;
    try {
        const data = await Rating.find({
            ownerId: owner_id
        });
        data.map((e) => {
            return rating += (e.rating.toFixed(2) / data.length);
        })


        res.status(200).send({ rate: rating })
    } catch (error) {

    }


});


router.post('/giveRating', auth, async (req, res) => {

    const { owner_id, rating } = req.body;
    console.log("RATE " + owner_id);
    await Rating.findOne({ renterId: req.user_id })
        .then(async (data) => {
            if (data) {
                await Rating.findOneAndUpdate(
                    {
                        renterId: req.user_id,
                        ownerId: owner_id
                    },
                    {
                        $set: {
                            rating: rating,
                        }
                    });
            }
            else {
                await Rating.create({
                    renterId: req.user_id,
                    ownerId: owner_id,
                    rating: rating,
                })
            }
        })
});
router.get('/notification', auth, async (req, res) => {
    console.log(req.user_id);
    await Notification.find({ recipient: "64240cfbeba5995db52dcec2" })
        .then((data) => res.status(200).send(data))
        .catch((e) => console.log(e));
})
module.exports = router;
const express = require('express');
const router = express.Router();

const Messages = require('../model/message');
const Owner = require('../model/owner');
const Renter = require('../model/renter');
const auth = require('../middleware/auth');
const { allSettled } = require('bluebird');
const { default: mongoose } = require('mongoose');


router.get('/allOwner', auth, async (req, res) => {
    await Owner.find({})
        .then((data) => res.status(200).send(data))
        .catch((error) => console.log(error));
});

router.get('/allRenter', auth, async (req, res) => {
    await Owner.find({})
        .then((data) => res.status(200).send(data))
        .catch((error) => console.log(error));
});

router.get('/ownerRoom/:recipient', auth, async (req, res) => {
    // try {

    const recipient = req.params.recipient;


    console.log("RECIPIENT ID: " + recipient);
    console.log("AUTH ID: " + req.user_id);

    // await Messages.aggregate([
    //     {
    //         $match: {
    //             sender: new mongoose.Types.ObjectId(req.user_id),
    //             recipient: new mongoose.Types.ObjectId(recipient)
    //         }
    //     },
    //     {
    //         $group: {
    //             _id: {
    //                 message: '$messages',
    //                 sender: new mongoose.Types.ObjectId(req.user_id),
    //                 recipient: new mongoose.Types.ObjectId(recipient),
    //             },

    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: 'owners',
    //             localField: 'sender',
    //             foreignField: '_id',
    //             as: 'owner'
    //         }
    //     },
    //     {
    //         $unwind: '$owner'
    //     },

    //     {
    //         $lookup: {
    //             from: 'renters',
    //             localField: 'recipient',
    //             foreignField: '_id',
    //             as: 'renter'
    //         }
    //     },
    //     {
    //         $unwind: '$renter'
    //     },

    // ])
    await Messages.aggregate([
        {
            $match: {
                sender: new mongoose.Types.ObjectId(recipient),
                recipient: new mongoose.Types.ObjectId(req.user_id)
            }
        },
        {
            $lookup: {
                from: 'owners',
                localField: 'recipient',
                foreignField: '_id',
                as: 'owner'
            }
        },
        {
            $unwind: '$owner'
        },
        {
            $unwind: '$owner._id'
        },
        {
            $lookup: {
                from: 'renters',
                localField: 'sender',
                foreignField: '_id',
                as: 'renter'
            }
        },
        {
            $unwind: '$renter'
        },
        {
            $unwind: '$renter._id'
        },

        {
            $group: {
                _id: '$_id',
                message: { $last: '$message' },
                sender: { $last: '$renter._id' },
                recipient: { $last: '$owner._id' },
                profilePic: {$last: '$renter.profilePic'},
                createAt: { $last: '$createAt' },
                updateAt: { $last: '$updateAt' },
               
            }
        }
    ]).sort({ 'updateAt': 1 })
        .then((data) => { res.status(200).send(data) })
        .catch((error) => console.log(error));

});
router.get('/renterRoom/:recipient', auth, async (req, res) => {
    // try {

    const recipient = req.params.recipient;
    const { isRenter } = req.body;

    console.log("TTTTTTTTT: " + isRenter);
    console.log("RECIPIENT ID: " + recipient);
    console.log("AUTH ID: " + req.user_id);
    await Messages.aggregate([
        {
            $match: {
                sender: new mongoose.Types.ObjectId(req.user_id),
                recipient: new mongoose.Types.ObjectId(recipient),
            }
        },
        {
            $lookup: {
                from: 'owners',
                localField: 'recipient',
                foreignField: '_id',
                as: 'owner'
            }
        },
        {
            $unwind: '$owner'
        },
        {
            $unwind: '$owner._id'
        },
        {
            $lookup: {
                from: 'renters',
                localField: 'sender',
                foreignField: '_id',
                as: 'renter'
            }
        },
        {
            $unwind: '$renter'
        },
        {
            $unwind: '$renter._id'
        },
        {
            $group: {
                _id: '$_id',
                message: { $last: '$message' },
                sender: { $last: '$renter._id' },
                recipient: { $last: '$owner._id' },
                profilePic: {$last: '$owner.profilePic'},
                createAt: { $last: '$createAt' },
                updateAt: { $last: '$updateAt' },
            }
        }
    ]).sort({ 'updateAt': 1 })
        .then((data) => { res.status(200).send(data) })
        .catch((error) => console.log(error));

});

router.get('/sentRenters', auth, async (req, res) => {
    console.log("HHHHH " + req.user_id);
    await Messages.aggregate([
        {
            $match: { sender: new mongoose.Types.ObjectId(req.user_id) }
        },
        {
            $lookup: {
                from: 'renters',
                localField: 'recipient',
                foreignField: '_id',
                as: 'renter'
            }
        },
        { $unwind: '$renter' },
        { $sort: { createAt: -1 } }
    ])
        .then((data) => {
            var clean = data.filter((arr, index, self) =>
                index === self.findIndex((t) => (t.sender.equals(arr.sender))))
            res.status(200).send(clean);
        })
        .catch((error) => console.log(error));

});
router.get('/sentOwners', auth, async (req, res) => {
    console.log("------------------------");
    await Messages.aggregate([
        {
            $match: { sender: new mongoose.Types.ObjectId(req.user_id) }
        },
        {
            $lookup: {
                from: 'owners',
                localField: 'recipient',
                foreignField: '_id',
                as: 'owner'
            }
        },
        { $unwind: '$owner' },
        { $sort: { createAt: -1 } }
    ])
        .then((data) => {
            var clean = data.filter((arr, index, self) =>
                index === self.findIndex((t) => (t.recipient.equals(arr.recipient))))
            res.status(200).send(clean);
        })
        .catch((error) => console.log(error));
});

router.post("/create", auth, async (req, res) => {
    const { recipient, message } = req.body;
    await Messages.create({
        sender: req.user_id,
        recipient: recipient,
        message: message,
    })
        .then((data) => res.status(200).send(data))
        .catch((error) => console.log(error));
});


router.get('/messages', auth, async (req, res) => {
    await Messages.find({ sender: req.user_id })
        .then((data) => res.status(200).send(data))
        .catch((error) => console.log(error));
})



router.post('/delete', auth, async (req, res) => {
    await Messages.findByIdAndRemove(req.body);
    console.log("delete");
})

module.exports = router;
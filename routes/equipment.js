const express = require('express');
const router = express.Router();

const Equipments = require('../schema/equipment');
const Locations = require('../schema/location');
const Categories = require('../schema/categories');

router.get('/locations', async (req, res) => {
    const { equip_id } = req.body;
    await Locations.find({}).then((data) => {
        res.status(200).send(data);
    }).catch((err) => {
        res.status(500).send(err)
    });
});

router.get("/equipment", async (req, res) => {
    await Equipments.find({ "ownerId": req.body })
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
});

router.get("/all", async (req, res) => {
    await Equipments.find({})
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
});

router.post("/create", async (req, res) => {
    try {
        await Equipments.create(req.body);
        res.status(200).send("ok");
    }
    catch (err) {
        console.log(err);

    }
});

router.get("/categories", async (req, res) => {
    await Categories.find({}).
        then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
});

module.exports = router;

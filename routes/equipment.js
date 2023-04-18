const express = require('express');
const router = express.Router();

const Equipment = require('../model/equipment');
const Categories = require('../model/categories');


router.get("/equipment", async (req, res) => {
    await Equipment.find({ "ownerId": req.body })
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
});

router.get("/owner/:id", async (req, res) => {
    await Equipment.find({ ownerId: req.params.id }).then((data) => {
        res.status(200).send(data);
    }).catch((err) => {
        res.status(500).send(err);
    });
});

router.get("/getEquipment/:id", async (req, res) => {
    await Equipment.findById(req.params.id).
        then((data) => res.status(200).send(data))
        .catch((error) => console.log(error));
})

router.delete("/delete/:id", async (req, res) => {
    await Equipment.findByIdAndDelete(req.params.id)
        .then(() => {
            res.status(200).send("success");
        })
        .catch((error) => console.log(error));
});

router.post("/update/:id", async (req, res) => {
    await Equipment.findByIdAndUpdate(req.params.id, req.body)
        .then(() => {
            res.status(200).send("success");
        })
        .catch((error) => console.log(error));
})

router.get("/all", async (req, res) => {
    await Equipment.find({})
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
});


router.get("/categories", async (req, res) => {
    await Categories.findOne({}).
        then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
});


module.exports = router;

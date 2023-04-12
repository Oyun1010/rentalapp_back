const mongoose = require('mongoose');

const Categories = mongoose.model("categories", new mongoose.Schema({
    categories: {type: Array}    

}));

module.exports = Categories;
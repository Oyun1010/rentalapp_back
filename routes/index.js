const express = require("express");

const equipment = require("./equipment");
const owner = require('./owner');

const mainRouters = (app) => {
  app.use('/equipment', equipment)
  app.use('/owner', owner);

//   app.use('/equipments', equipments);

}
module.exports = mainRouters
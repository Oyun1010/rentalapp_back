const express = require("express");

const equipment = require("./equipment");
const owner = require('./owner');
const message = require('./message');
const renter = require('./renter');
const admin = require('./admin');

const mainRouters = (app) => {
  app.use('/equipment', equipment)
  app.use('/owner', owner);
  app.use('/message', message);
  app.use('/renter', renter);
  app.use('/admin', admin);

}
module.exports = mainRouters
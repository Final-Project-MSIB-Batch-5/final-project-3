const route = require("express").Router();
const userRoutes = require("./UserRoutes");

route.use(userRoutes);

module.exports = route;

const route = require("express").Router();
const userRoutes = require("./UserRoutes");
const categoryRoutes = require("./CategoryRoutes");
const { authentication } = require("../middlewares/auth");
const { adminFilter } = require("../middlewares/admin");

route.use("/users", userRoutes);
route.use("/categories", authentication, adminFilter, categoryRoutes);

module.exports = route;

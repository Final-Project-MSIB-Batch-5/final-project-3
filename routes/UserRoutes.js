const route = require("express").Router();
const UserController = require("../controllers/UserController");

route.post("/users/register", UserController.register);

module.exports = route;

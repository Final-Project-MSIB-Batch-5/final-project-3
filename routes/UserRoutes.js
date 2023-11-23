const route = require("express").Router();
const UserController = require("../controllers/UserController");
const { authentication } = require("../middlewares/auth");

route.post("/register", UserController.register);
route.post("/login", UserController.login);
route.use(authentication);
route.put("/", UserController.updatedUserById);
route.delete("/", UserController.deletedUserById);
route.patch("/topup", UserController.topUp);

module.exports = route;

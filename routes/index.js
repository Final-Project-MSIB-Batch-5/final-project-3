const route = require("express").Router();
const userRoutes = require("./UserRoutes");
const categoryRoutes = require("./CategoryRoutes");
const productRoutes = require("./ProductRoutes");
const transactionHistoryRoutes = require("./TransactionHistoryRoutes");
const { authentication } = require("../middlewares/auth");
const { adminFilter } = require("../middlewares/admin");

route.use("/users", userRoutes);
route.use(authentication);
route.use("/categories", adminFilter, categoryRoutes);
route.use("/products", productRoutes);
route.use("/transactions", transactionHistoryRoutes);

module.exports = route;

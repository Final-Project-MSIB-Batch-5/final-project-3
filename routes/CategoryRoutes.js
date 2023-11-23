const route = require("express").Router();
const CategoryController = require("../controllers/CategoryController");

route.post("/", CategoryController.addCategory);
route.get("/", CategoryController.getAllCategories);
route.patch("/:categoryId", CategoryController.updatedCategoryById);
route.delete("/:categoryId", CategoryController.deletedCategoryById);

module.exports = route;

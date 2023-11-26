const router = require("express").Router();
const ProductController = require("../controllers/ProductController");
const { adminFilter } = require("../middlewares/admin");

router.get("/", ProductController.readProduct);
router.use(adminFilter);
router.post("/", ProductController.createProduct);
router.put("/:productId", ProductController.updateProductById);
router.patch("/:productId", ProductController.updateCategoryProduct);
router.delete("/:productId", ProductController.deleteProductById);

module.exports = router;

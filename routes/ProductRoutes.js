const router = require("express").Router();
const ProductController = require("../controllers/ProductController");
const authentication = require("../middlewares/authentication");

router.use(authentication);
router.post("/", ProductController.createProduct);
router.get("/", ProductController.readProduct);
router.put("/:productId", ProductController.updateProductById);
router.patch("/:productId", ProductController.updateCategoryProduct);
router.delete("/:productId", ProductController.deleteProductById);

module.exports = router;
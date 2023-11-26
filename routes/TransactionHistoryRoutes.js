const router = require("express").Router();
const TransactionHistory = require("../controllers/TransactionHistoryController");
const { adminFilter } = require("../middlewares/admin");

router.post("/", TransactionHistory.createTransactionHistory);
router.get("/user", TransactionHistory.getAllTransactionHistoryUsers);
router.get(
  "/admin",
  adminFilter,
  TransactionHistory.getAllTransactionHistoryAdmins
);
router.get("/:id", TransactionHistory.getTransactionHistoryById);

module.exports = router;

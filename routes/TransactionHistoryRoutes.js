const router = require("express").Router();
const TransactionHistory = require("../controllers/TransactionHistoryController");
const authenticationTransactionHistory = require("../middlewares/authenticationTransactionHistory");

router.use(authenticationTransactionHistory);

router.post("/", TransactionHistory.createTransactionHistory);
router.get("/user", TransactionHistory.getAllTransactionHistoryUsers);
router.get("/admin", TransactionHistory.getAllTransactionHistoryAdmins);
router.get("/:id", TransactionHistory.getTransactionHistoryById);

module.exports = router;
const { TransactionHistory, Product, User, Category } = require("../models");

class TransactionHistoryController {
  static async createTransactionHistory(req, res) {
    try {
      const { productId, quantity } = req.body;
      const user = res.locals.user;
      const product = await Product.findByPk(productId);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      if (quantity > product.stock) {
        return res.status(400).json({
          message: "Insufficient product stock",
        });
      }

      const totalPrice = product.price * quantity;
      if (user.balance < totalPrice) {
        return res.status(400).json({
          message: "Insufficient balance",
        });
      }

      const transaction = await TransactionHistory.sequelize.transaction();

      try {
        product.stock -= quantity;
        await product.save({ transaction });

        user.balance -= totalPrice;
        await user.save({ transaction });

        const category = await Category.findByPk(product.CategoryId);
        category.sold_product_amount += quantity;
        await category.save({ transaction });

        const transactionHistory = await TransactionHistory.create(
          {
            UserId: user.id,
            ProductId: product.id,
            quantity,
            total_price: totalPrice,
          },
          { transaction }
        );

        await transaction.commit();

        return res.status(201).json({
          message: "You have successfully purchased the product",
          transactionBill: {
            total_price: totalPrice,
            quantity,
            product_name: product.title,
          },
        });
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  static async getAllTransactionHistoryUsers(req, res) {
    try {
      const user = res.locals.user;

      const transactions = await TransactionHistory.findAll({
        where: {
          UserId: user.id,
        },
        include: {
          model: Product,
          attributes: ["name"],
        },
        attributes: ["total_price", "quantity"],
      });

      res.status(200).json({ transactions });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getAllTransactionHistoryAdmins(req, res) {}

  static async getTransactionHistoryById(req, res) {
    try {
      const { id } = req.params;
      const user = res.locals.user;

      const transaction = await TransactionHistory.findOne({
        where: { id },
        include: Product,
      });

      if (!transaction) {
        return res.status(404).json({
          message: "Transaction not found",
        });
      }

      if (user.role !== "admin" && transaction.UserId !== user.id) {
        return res.status(401).json({
          message: "Unauthorized access",
        });
      }

      res.status(200).json({ transaction });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
}

module.exports = TransactionHistoryController;
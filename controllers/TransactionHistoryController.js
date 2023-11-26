const { TransactionHistory, Product, User, Category } = require("../models");
const { formatToRupiah } = require("../helpers/currency");

class TransactionHistoryController {
  static async createTransactionHistory(req, res) {
    try {
      const { ProductId, quantity } = req.body;

      const product = await Product.findByPk(ProductId);

      const user = await User.findByPk(req.userData.id);

      if (!product) {
        throw {
          code: 404,
          message: "Product not found.",
        };
      }

      if (!user) {
        throw {
          code: 404,
          message: "User not found.",
        };
      }

      if (quantity > product.stock) {
        throw {
          code: 400,
          message: "Insufficient product stock.",
        };
      }

      const totalPrice = product.price * quantity;
      if (user.balance < totalPrice) {
        throw {
          code: 400,
          message: "Insufficient balance.",
        };
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
            total_price: formatToRupiah(transactionHistory.total_price),
            quantity: transactionHistory.quantity,
            product_name: product.title,
          },
        });
      } catch (error) {
        await transaction.rollback();
        if (error.name === "SequelizeValidationError") {
          const validationErrors = error.errors.map((err) => ({
            field: err.path,
            message: err.message,
          }));
          res.status(422).json({ errors: validationErrors });
        } else {
          res.status(error.code || 500).json({ message: error.message });
        }
      }
    } catch (error) {
      res.status(error.code || 500).json({
        message: error.message,
      });
    }
  }

  static async getAllTransactionHistoryUsers(req, res) {
    try {
      const userId = req.userData.id;

      const transactions = await TransactionHistory.findAll({
        where: {
          UserId: userId,
        },
        include: {
          model: Product,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        attributes: { exclude: ["id"] },
      });

      const transactionsHistories = transactions.map((transaction) => {
        return {
          ProductId: transaction.ProductId,
          UserId: transaction.UserId,
          quantity: transaction.quantity,
          total_price: formatToRupiah(transaction.total_price),
          createdAt: transaction.createdAt,
          updatedAt: transaction.updatedAt,
          Product: {
            id: transaction.Product.id,
            title: transaction.Product.title,
            price: formatToRupiah(transaction.Product.price),
            stock: transaction.Product.stock,
            CategoryId: transaction.Product.CategoryId,
          },
        };
      });

      res.status(200).json({ transactionsHistories });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  static async getAllTransactionHistoryAdmins(req, res) {
    try {
      const transactions = await TransactionHistory.findAll({
        include: [
          {
            model: Product,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: User,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
      });

      const transactionHistories = transactions.map((transaction) => {
        return {
          ProductId: transaction.ProductId,
          UserId: transaction.UserId,
          quantity: transaction.quantity,
          total_price: formatToRupiah(transaction.total_price),
          createdAt: transaction.createdAt,
          updatedAt: transaction.updatedAt,
          Product: {
            id: transaction.Product.id,
            title: transaction.Product.title,
            price: formatToRupiah(transaction.Product.price),
            stock: transaction.Product.stock,
            CategoryId: transaction.Product.CategoryId,
          },
          User: {
            id: transaction.User.id,
            email: transaction.User.email,
            balance: formatToRupiah(transaction.User.balance),
            gender: transaction.User.gender,
            role: transaction.User.role,
          },
        };
      });

      res.status(200).json({ transactionHistories });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getTransactionHistoryById(req, res) {
    try {
      const { id } = req.params;

      const transaction = await TransactionHistory.findOne({
        where: { id },
        include: Product,
      });

      if (!transaction) {
        throw {
          code: 404,
          message: "Transaction not found",
        };
      }

      if (
        req.userData.role !== "admin" &&
        transaction.UserId !== req.userData.id
      ) {
        throw {
          code: 401,
          message: "Unauthorized access.",
        };
      }

      res.status(200).json({
        ProductId: transaction.ProductId,
        UserId: transaction.UserId,
        quantity: transaction.quantity,
        total_price: formatToRupiah(transaction.total_price),
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
        Product: {
          id: transaction.Product.id,
          title: transaction.Product.title,
          price: formatToRupiah(transaction.Product.price),
          stock: transaction.Product.stock,
          CategoryId: transaction.Product.CategoryId,
        },
      });
    } catch (err) {
      res.status(err.code || 500).json({
        message: err.message,
      });
    }
  }
}

module.exports = TransactionHistoryController;

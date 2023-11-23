const { Category, Product } = require("../models");

class CategoryController {
  static async addCategory(req, res) {
    try {
      const { type } = req.body;

      const data = await User.create({
        type,
      });

      res.status(201).json({
        category: {
          id: data.id,
          type: data.type,
          updatedAt: data.updatedAt,
          createdAt: data.createdAt,
          sold_product_amount: data.sold_product_amount,
        },
      });
    } catch (error) {
      if (
        error.name === "SequelizeUniqueConstraintError" ||
        error.name === "SequelizeValidationError"
      ) {
        const validationErrors = error.errors.map((err) => ({
          field: err.path,
          message: err.message,
        }));
        res.status(422).json({ errors: validationErrors });
      } else {
        res.status(error.code || 500).json({ message: error.message });
      }
    }
  }

  static async getAllCategories(req, res) {
    try {
      const data = await Category.findAll({
        include: {
          model: Product,
        },
      });

      res.status(200).json({ categories: data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updatedCategoryById(req, res) {
    try {
      const { type } = req.body;
      const { categoryId } = req.params;

      const [arrowAffected, [data]] = await Category.update(
        {
          type,
        },
        {
          where: {
            id: categoryId,
          },
          returning: true,
        }
      );

      if (arrowAffected === 0) {
        throw {
          code: 404,
          message: "Category not found!",
        };
      }

      res.status(200).json({ category: data });
    } catch (error) {
      if (
        error.name === "SequelizeUniqueConstraintError" ||
        error.name === "SequelizeValidationError"
      ) {
        const validationErrors = error.errors.map((err) => ({
          field: err.path,
          message: err.message,
        }));
        res.status(422).json({ errors: validationErrors });
      } else {
        res.status(error.code || 500).json({ message: error.message });
      }
    }
  }

  static async deletedCategoryById(req, res) {
    try {
      const { categoryId } = req.params;

      const data = await Category.destroy({
        where: {
          id: categoryId,
        },
      });

      if (!data) {
        throw {
          code: 404,
          message: "Category not found!",
        };
      }

      res
        .status(200)
        .json({ message: "Category has been successfully deleted" });
    } catch (error) {
      res.status(error.code || 500).json({ message: error.message });
    }
  }
}

module.exports = CategoryController;

const { Product, Category } = require("../models");
const { formatToRupiah } = require("../helpers/currency");

class ProductController {
  static async createProduct(req, res) {
    try {
      const { title, price, stock, CategoryId } = req.body;

      // check Category
      const category = await Category.findOne({
        where: {
          id: CategoryId,
        },
      });

      if (!category) {
        throw {
          code: 404,
          message: "Category not found.",
        };
      }

      const data = await Product.create({
        title,
        price,
        stock,
        CategoryId,
      });

      res.status(201).json({
        product: {
          id: data.id,
          title: data.title,
          price: formatToRupiah(data.price),
          stock: data.stock,
          CategoryId: data.CategoryId,
          updatedAt: data.updatedAt,
          createdAt: data.createdAt,
        },
      });
    } catch (error) {
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
  }

  static readProduct(req, res) {
    Product.findAll()
      .then((data) => {
        const products = data.map((product) => {
          return {
            id: product.id,
            title: product.title,
            price: formatToRupiah(product.price),
            stock: product.stock,
            CategoryId: product.CategoryId,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
          };
        });
        res.status(200).json({ products });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }

  static updateProductById(req, res) {
    let id = +req.params.productId;
    const { title, price, stock } = req.body;
    let data = {
      title,
      price,
      stock,
    };
    Product.update(data, {
      where: {
        id,
      },
      returning: true,
    })
      .then((data) => {
        if (data[0] === 0) {
          throw {
            code: 404,
            message: "Product not found.",
          };
        }
        res.status(200).json({
          product: {
            id: data[1][0].id,
            title: data[1][0].title,
            price: formatToRupiah(data[1][0].price),
            stock: data[1][0].stock,
            CategoryId: data[1][0].CategoryId,
            createdAt: data[1][0].createdAt,
            updatedAt: data[1][0].updatedAt,
          },
        });
      })
      .catch((error) => {
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
      });
  }

  static async updateCategoryProduct(req, res) {
    try {
      let id = +req.params.productId;
      const { CategoryId } = req.body;

      const category = await Category.findOne({
        where: {
          id: CategoryId,
        },
      });

      if (!category) {
        throw {
          code: 404,
          message: "Category not found.",
        };
      }

      const [arrowAffected, [data]] = await Product.update(
        {
          CategoryId,
        },
        {
          where: {
            id: id,
          },
          returning: true,
        }
      );

      if (arrowAffected === 0) {
        throw {
          code: 404,
          message: "Product not found.",
        };
      }

      res.status(200).json({
        product: {
          id: data.id,
          title: data.title,
          price: formatToRupiah(data.price),
          stock: data.stock,
          CategoryId: data.CategoryId,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        },
      });
    } catch (error) {
      res.status(error.code || 500).json({ message: error.message });
    }
  }

  static deleteProductById(req, res) {
    const id = +req.params.productId;
    Product.destroy({
      where: {
        id,
      },
    })
      .then((arrowAffected) => {
        if (arrowAffected === 0) {
          throw {
            code: 404,
            message: "Product not found.",
          };
        }
        res
          .status(200)
          .json({ message: "Product has been successfully deleted" });
      })
      .catch((err) => {
        res.status(err.code || 500).json({ message: err.message });
      });
  }
}

module.exports = ProductController;

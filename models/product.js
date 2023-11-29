"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Category, { foreignKey: "CategoryId" });
      this.hasMany(models.TransactionHistory, { foreignKey: "ProductId" });
    }
  }
  Product.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Title be not null.",
          },
          notEmpty: {
            args: true,
            msg: "Title be required.",
          },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Price be not null.",
          },
          notEmpty: {
            args: true,
            msg: "Price be required.",
          },
          isInt: {
            args: true,
            msg: "Price must be an integer value.",
          },
          max: {
            args: 50000000,
            msg: "Price cannot exceed 50000000.",
          },
          min: {
            args: [0],
            msg: "Price cannot be less than 0.",
          },
        },
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Stock be not null.",
          },
          notEmpty: {
            args: true,
            msg: "Stock be required.",
          },
          isInt: {
            args: true,
            msg: "Stock must be an integer value.",
          },
          min: {
            args: 5,
            msg: "Stock cannot be less than 5.",
          },
        },
      },
      CategoryId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};

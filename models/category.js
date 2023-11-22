"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Product, { foreignKey: "CategoryId" });
    }
  }
  Category.init(
    {
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Type be not null.",
          },
          notEmpty: {
            args: true,
            msg: "Type be required.",
          },
        },
      },
      sold_product_amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Sold Product Amount be not null.",
          },
          notEmpty: {
            args: true,
            msg: "Sold Product Amount be required.",
          },
          isInt: {
            args: true,
            msg: "Sold Product Amount must be an integer value.",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Category",
    }
  );
  return Category;
};

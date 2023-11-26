"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TransactionHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: "UserId" });
      this.belongsTo(models.Product, { foreignKey: "ProductId" });
    }
  }
  TransactionHistory.init(
    {
      ProductId: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER,
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Quantity be not null.",
          },
          notEmpty: {
            args: true,
            msg: "Quantity be required.",
          },
          isInt: {
            args: true,
            msg: "Quantity must be an integer value.",
          },
        },
      },
      total_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Total price be not null.",
          },
          notEmpty: {
            args: true,
            msg: "Total price be required.",
          },
          isInt: {
            args: true,
            msg: "Total price must be an integer value.",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "TransactionHistory",
    }
  );
  return TransactionHistory;
};

"use strict";
const { Model } = require("sequelize");
const { hashPassword } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.TransactionHistory, { foreignKey: "UserId" });
    }
  }
  User.init(
    {
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Full name be not null.",
          },
          notEmpty: {
            args: true,
            msg: "Full name be required.",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Email be not null.",
          },
          notEmpty: {
            args: true,
            msg: "Email be required.",
          },
          isEmail: {
            args: true,
            msg: "Invalid email address format.",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Password be not null.",
          },
          notEmpty: {
            args: true,
            msg: "Password be required.",
          },
          len: {
            args: [6, 10],
            msg: "Password should be 6 to 10 in length.",
          },
        },
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Gender be not null.",
          },
          notEmpty: {
            args: true,
            msg: "Gender be required.",
          },
          isIn: {
            args: [["male", "female"]],
            msg: "Gender must be male or female.",
          },
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Role be not null.",
          },
          notEmpty: {
            args: true,
            msg: "Role be required.",
          },
          isIn: {
            args: [["admin", "customer"]],
            msg: "Role must be admin or customer.",
          },
        },
      },
      balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Balance be not null.",
          },
          notEmpty: {
            args: true,
            msg: "Balance be required.",
          },
          isInt: {
            args: true,
            msg: "Balance must be an integer value.",
          },
          min: {
            args: [0],
            msg: "Balance cannot be less than 0.",
          },
          max: {
            args: 100000000,
            msg: "Balance cannot exceed 100000000.",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeValidate: (user, options) => {
          user.balance = user.balance || 0;
        },
        beforeCreate: (user, options) => {
          const hashedPassword = hashPassword(user.password);
          user.password = hashedPassword;
        },
      },
    }
  );
  return User;
};

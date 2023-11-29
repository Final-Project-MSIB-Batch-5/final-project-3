const { User } = require("../models");
const { formatToRupiah } = require("../helpers/currency");
const { comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const { INTEGER } = require("sequelize");

class UserController {
  static async register(req, res) {
    try {
      const { full_name, password, gender, email } = req.body;

      const data = await User.create({
        full_name,
        password,
        gender,
        email,
        role: "customer",
      });

      res.status(201).json({
        user: {
          id: data.id,
          full_name: data.full_name,
          email: data.email,
          gender: data.gender,
          balance: formatToRupiah(data.balance),
          createdAt: data.createdAt,
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

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const data = await User.findOne({
        where: {
          email: email,
        },
      });

      if (!data) {
        throw {
          code: 404,
          message: "User not registered!",
        };
      }

      const verifyPassword = comparePassword(password, data.password);

      if (!verifyPassword) {
        throw {
          code: 401,
          message: "Incorrect password!",
        };
      }

      const token = generateToken({
        id: data.id,
        email: data.email,
        role: data.role,
      });

      res.status(200).json({ token: token });
    } catch (error) {
      res.status(error.code || 500).json({ message: error.message });
    }
  }

  static async updatedUserById(req, res) {
    try {
      const { full_name, email } = req.body;

      const [arrowAffected, [data]] = await User.update(
        {
          full_name,
          email,
        },
        {
          where: {
            id: req.userData.id,
          },
          returning: true,
        }
      );

      if (arrowAffected === 0) {
        throw {
          code: 404,
          message: "User not found.",
        };
      }

      res.status(200).json({
        user: {
          id: data.id,
          full_name: data.full_name,
          email: data.email,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
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

  static async deletedUserById(req, res) {
    try {
      const data = await User.destroy({
        where: {
          id: req.userData.id,
        },
      });

      if (!data) {
        throw {
          code: 404,
          message: "User not found!",
        };
      }

      res
        .status(200)
        .json({ message: "Your account has been successfully deleted" });
    } catch (error) {
      res.status(error.code || 500).json({ message: error.message });
    }
  }

  static async topUp(req, res) {
    try {
      const { balance } = req.body;
      const id = req.userData.id;
      const newUserModel = User.build({ balance, id });

      await newUserModel.validate({ fields: ["balance"] });

      const user = await User.findOne({
        where: {
          id: id,
        },
      });
      const newBalance = parseInt(balance) + parseInt(user.balance);

      const [arrowAffected, [data]] = await User.update(
        {
          balance: newBalance,
        },
        {
          where: {
            id: req.userData.id,
          },
          returning: true,
        }
      );

      if (arrowAffected === 0) {
        throw {
          code: 404,
          message: "User not found!",
        };
      }

      res.status(200).json({
        message: `Your balance has been successfully updated to ${formatToRupiah(
          data.balance
        )}`,
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
}

module.exports = UserController;

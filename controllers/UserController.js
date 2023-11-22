const { User } = require("../models");

class UserController {
  static async register(req, res) {
    try {
      const { full_name, password, gender, email } = req.body;

      const data = await User.create({
        full_name,
        password,
        gender,
        email,
      });

      res.status(201).json({
        user: {
          id: data.id,
          full_name: data.full_name,
          email: data.email,
          gender: data.gender,
          balance: data.balance,
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
}

module.exports = UserController;

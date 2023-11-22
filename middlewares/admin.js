const adminFilter = async (req, res, next) => {
  try {
    // cek user role
    if (req.userData.role !== "admin") {
      throw {
        code: 401,
        message: "You do not have permission to access as an admin.",
      };
    }

    next();
  } catch (error) {
    res.status(error.code || 500).json({ message: error.message });
  }
};

module.exports = { adminFilter };

const bcrypt = require("bcryptjs");

const comparePassword = (plainPassword, hashedPassword) => {
  return bcrypt.compareSync(plainPassword, hashedPassword);
};

const hashPassword = (plainPassword) => {
  const salt = bcrypt.genSaltSync(12);

  return bcrypt.hashSync(plainPassword, salt);
};

module.exports = {
  comparePassword,
  hashPassword,
};

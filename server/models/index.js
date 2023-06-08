const { Sequelize } = require("sequelize");
const { sequelize } = require("../db");

const User = sequelize.define("users", {
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  elementType: Sequelize.STRING,
  team: {
    type: Sequelize.ARRAY(Sequelize.JSONB),
    defaultValue: [],
  },
});

module.exports = {
  db: sequelize,
  User,
};
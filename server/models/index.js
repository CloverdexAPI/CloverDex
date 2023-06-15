const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const User = sequelize.define("users", {
  name:  DataTypes.STRING,
  email:  DataTypes.STRING,
  username:  DataTypes.STRING,
  password:  DataTypes.STRING,
  elementType:  DataTypes.STRING,
});

module.exports = {
  db: sequelize,
  User,
};
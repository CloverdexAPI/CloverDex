const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const User = sequelize.define("users", {
  name:  DataTypes.STRING,
  email:  DataTypes.STRING,
  username:  DataTypes.STRING,
  password:  DataTypes.STRING,
  elementType:  DataTypes.STRING,
  team: {
    type: DataTypes.ARRAY(DataTypes.JSON), // Specify the column type as an array of JSON objects
    defaultValue: [], // Set a default empty array
    allowNull: false,
  },
});

module.exports = {
  db: sequelize,
  User,
};
const { Sequelize } = require("sequelize");
const { sequelize } = require("../db");

const User = sequelize.define("users", {
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  elementType: Sequelize.STRING,
  team: {
    type: Sequelize.TEXT,
    defaultValue: "[]",
    get() {
      const team = this.getDataValue("team");
      return JSON.parse(team);
    },
    set(value) {
      this.setDataValue("team", JSON.stringify(value));
    },
  },
});

module.exports = {
  db: sequelize,
  User,
};
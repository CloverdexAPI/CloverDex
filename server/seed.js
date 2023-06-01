const {sequelize} = require('./db');
const {User} = require('./models');

const seed = async () => {

    try {
        // drop and recreate tables per model definitions
        await sequelize.sync({ force: true });
        const users = await User.findAll();
        // insert data
        await Promise.all(users.map(user => User.create(user)));

        console.log("db populated!");
    } catch (error) {
        console.error(error);
    }
}

seed();
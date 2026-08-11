const db = require('../../models');

const User = db.Login;

const sequelize = db.sequelize;

const findUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ where: { email } });
        return user;
    } catch (error) {
        console.error("Error finding user by email:", error);
        throw error;
    } 
};

const createUser = async (username, email, password) => {
    try {
        const newUser = await User.create({ username, email, password });
        return newUser;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

module.exports = {
    findUserByEmail,
    createUser
};
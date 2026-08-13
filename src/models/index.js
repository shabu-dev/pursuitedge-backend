const Sequelize = require('sequelize');
const dbConfig = require('../config/db');

// Sequelize instance
const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: dbConfig.dialect,
        logging: dbConfig.logging,
        pool: dbConfig.pool
});

sequelize.sync()
    .then(() => {
        console.log('Database synchronized');
    })
    .catch((error) => {
        console.error('Error synchronizing database:', error);
    });

    const db = {};
    db.Sequelize = Sequelize;
    db.sequelize = sequelize;

    db.Login = require('./Login/loginModel')(sequelize, Sequelize);
    db.Schedule = require('./Schedule/scheduleModel')(sequelize, Sequelize);
    db.Course = require('./Course/courseModel')(sequelize, Sequelize);

    module.exports = db;
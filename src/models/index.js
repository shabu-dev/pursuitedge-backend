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

    // Course models
    db.Course = require('./Course/courseModel')(sequelize, Sequelize);
    db.CourseContent = require('./Course/courseContentModel')(sequelize,Sequelize);
    db.Category = require('./Course/categoryModel')(sequelize, Sequelize);

    // Associations
    db.Course.hasOne(db.CourseContent, {foreignKey: 'course_id',as: 'content',onDelete: 'CASCADE',onUpdate: 'CASCADE',});
    db.CourseContent.belongsTo(db.Course, {foreignKey: 'course_id',as: 'course',});
    
    module.exports = db;
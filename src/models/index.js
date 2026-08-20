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
    db.Instructor = require('./Course/instructorModel')(sequelize, Sequelize);
    db.Testimonial = require('./Course/testimonialModel')(sequelize,Sequelize);

    //Country Models
    db.Country = require('./Country/countryModel')(sequelize,Sequelize);

    //Blog Models
    db.Blog = require('./Blog/blogModel')(sequelize,Sequelize);

    //Support Models
    db.SupportTicket = require('./Support/ticketModel')(sequelize,Sequelize);
    db.SupportTicketMessage = require('./Support/ticketMessageModel')(sequelize,Sequelize);
    db.SupportTicketAttachment = require('./Support/ticketAttachmentModel')(sequelize,Sequelize);
    db.SupportTicketHistory = require('./Support/ticketHistoryModel')(sequelize,Sequelize);

    // Contact Model
    db.Contact = require('./Contact/contactModel')(sequelize, Sequelize);
    
    // Associations
    db.Course.hasOne(db.CourseContent, {foreignKey: 'course_id',as: 'content',onDelete: 'CASCADE',onUpdate: 'CASCADE',});
    db.CourseContent.belongsTo(db.Course, {foreignKey: 'course_id',as: 'course',});

    // ===============================
    // Support Ticket Associations
    // ===============================
    
    db.SupportTicket.hasMany(db.SupportTicketMessage,{foreignKey: 'ticket_id', as: 'messages', onDelete: 'CASCADE',onUpdate: 'CASCADE'});
    db.SupportTicketMessage.belongsTo(db.SupportTicket,{    foreignKey: 'ticket_id',    as: 'ticket'});
    db.SupportTicketMessage.hasMany(db.SupportTicketAttachment,{foreignKey: 'message_id', as: 'attachments',onDelete: 'CASCADE',onUpdate: 'CASCADE'});
    db.SupportTicketAttachment.belongsTo(db.SupportTicketMessage,{foreignKey: 'message_id',    as: 'message'});
    db.SupportTicket.hasMany(db.SupportTicketHistory,{foreignKey: 'ticket_id',as: 'history', onDelete: 'CASCADE',onUpdate: 'CASCADE'});
    db.SupportTicketHistory.belongsTo(db.SupportTicket,{foreignKey: 'ticket_id',as: 'ticket'});

    module.exports = db;
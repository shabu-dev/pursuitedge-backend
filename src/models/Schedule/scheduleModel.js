module.exports = (sequelize, Sequelize) => {
  const Schedule = sequelize.define('schedule', {
    course: {
        type: Sequelize.STRING,
        allowNull: false
    },
    trainer_name: {
        type: Sequelize.STRING, 
        allowNull: true
    },
    batch_start: {
        type: Sequelize.DATE,
        allowNull: false
    },
    batch_end: {
        type: Sequelize.DATE,
        allowNull: false
    },
    weekend_dates: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    batch_type: {
        type: Sequelize.STRING, 
        allowNull: false
    },
    time_slot: {
        type: Sequelize.STRING,
        allowNull: false
    },
    start_time: {
        type: Sequelize.TIME,
        allowNull: false
    },
    end_time: {
        type: Sequelize.TIME,
        allowNull: false
    },
    offer_price: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    original_price: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    country: {
        type: Sequelize.STRING,
        allowNull: false
    },
    course_type: {
        type: Sequelize.STRING,
        allowNull: false
    },
    seats_left: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false
    },
    },{
        timestamps: true
    }); 
    
    return Schedule;
};

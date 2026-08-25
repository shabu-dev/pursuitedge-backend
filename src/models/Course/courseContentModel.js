module.exports = (sequelize, Sequelize) => {
    const CourseContent = sequelize.define(
        'course_content',
        {
            id: {
                type: Sequelize.STRING,
                primaryKey: true,
                allowNull: false,
            },

            course_id: {
                type: Sequelize.UUID,
                allowNull: false,
                unique: true,
            },

            why_earn: {
                type: Sequelize.JSON,
                allowNull: true,
            },

            exam_domains: {
                type: Sequelize.JSON,
                allowNull: true,
            },

            training_agenda: {
                type: Sequelize.JSON,
                allowNull: true,
            },

            exam_glance: {
                type: Sequelize.JSON,
                allowNull: true,
            },

            eligibility: {
                type: Sequelize.JSON,
                allowNull: true,
            },

            target_audience: {
                type: Sequelize.JSON,
                allowNull: true,
            },

            learning_modes: {
                type: Sequelize.JSON,
                allowNull: true,
            },

            pass_guarantee: {
                type: Sequelize.JSON,
                allowNull: true,
            },

            inclusions: {
                type: Sequelize.JSON,
                allowNull: true,
            },

            achievements: {
                type: Sequelize.JSON,
                allowNull: true,
            },

            outcomes: {
                type: Sequelize.JSON,
                allowNull: true,
            },

            bottom_cta: {
                type: Sequelize.JSON,
                allowNull: true,
            },
        },
        {
            tableName: 'course_content',
            timestamps: true,
            engine: 'InnoDB',
            rowFormat: 'DYNAMIC',
        }
    );

    return CourseContent;
};
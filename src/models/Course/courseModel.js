module.exports = (sequelize, Sequelize) => {
    const Course = sequelize.define(
        'course',
        {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },

            slug: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true,
            },

            title: {
                type: Sequelize.STRING(200),
                allowNull: false,
            },

            // Keeping name because your existing table has it.
            // It can contain the same value as title.
            name: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },

            category: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },

            duration: {
                type: Sequelize.STRING(50),
                allowNull: true,
            },

            overview: {
                type: Sequelize.TEXT,
                allowNull: true,
            },

            hero_title: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },

            hero_subtitle: {
                type: Sequelize.TEXT,
                allowNull: true,
            },

            hero_image: {
                type: Sequelize.TEXT,
                allowNull: true,
            },

            badge_text: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },

            primary_cta: {
                type: Sequelize.STRING(100),
                allowNull: true,
                defaultValue: 'Enroll Now',
            },

            secondary_cta: {
                type: Sequelize.STRING(100),
                allowNull: true,
                defaultValue: 'View Syllabus',
            },

            level: {
                type: Sequelize.STRING(50),
                allowNull: true,
                defaultValue: 'Beginner',
            },

            language: {
                type: Sequelize.STRING(30),
                allowNull: true,
                defaultValue: 'English',
            },

            status: {
                type: Sequelize.STRING(30),
                allowNull: true,
                defaultValue: 'Draft',
            },

            price: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: true,
                defaultValue: 0,
            },

            discount_price: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: true,
                defaultValue: 0,
            },

            seo_title: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },

            seo_description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },

            image_url: {
                type: Sequelize.TEXT,
                allowNull: true,
            },

            // JSON fields
            highlights: {
                type: Sequelize.JSON,
                allowNull: true,
                defaultValue: [],
            },

            curriculum: {
                type: Sequelize.JSON,
                allowNull: true,
                defaultValue: [],
            },

            pricing: {
                type: Sequelize.JSON,
                allowNull: true,
                defaultValue: [],
            },

            faqs: {
                type: Sequelize.JSON,
                allowNull: true,
                defaultValue: [],
            },
        },
        {
            tableName: 'courses',
            timestamps: true,
            engine: 'InnoDB',
            rowFormat: 'DYNAMIC',
        }
    );

    return Course;
};
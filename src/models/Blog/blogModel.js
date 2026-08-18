module.exports = (sequelize, Sequelize) => {
    const Blog = sequelize.define(
        "Blog",
        {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },

            title: {
                type: Sequelize.STRING(255),
                allowNull: false
            },

            slug: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true
            },

            excerpt: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            content: {
                type: Sequelize.TEXT("long"),
                allowNull: false
            },

            cover_image_url: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            category: {
                type: Sequelize.STRING(100),
                allowNull: true
            },

            tags: {
                type: Sequelize.JSON,
                allowNull: true
            },

            author: {
                type: Sequelize.STRING(100),
                allowNull: true
            },

            read_time_minutes: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0
            },

            is_published: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },

            meta_title: {
                type: Sequelize.STRING(255),
                allowNull: true
            },

            meta_description: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            published_at: {
                type: Sequelize.DATE,
                allowNull: true
            },

            status: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
        },
        {
            tableName: "blogs",
            timestamps: true
        }
    );

    return Blog;
};
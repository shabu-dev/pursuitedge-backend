module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define(
        'category',
        {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING(150),
                allowNull: false,
                unique: true,
            },
            slug: {
                type: Sequelize.STRING(150),
                allowNull: false,
                unique: true,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            status: {
                type: Sequelize.STRING(30),
                allowNull: true,
                defaultValue: 'active',
            },
             order : {
                type: Sequelize.INTEGER,
                allowNull: true,
            }
        },
        {
            tableName: 'categories',
            timestamps: true,
        }
    );

    return Category;
};

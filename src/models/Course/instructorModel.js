module.exports = (sequelize, Sequelize) => {
    const Instructor = sequelize.define('Instructor', {
        id: { 
            type: Sequelize.UUID, 
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true 
        },
        name: { 
            type: Sequelize.STRING(255), 
            allowNull: false 
        },
        title: { 
            type: Sequelize.STRING(255), 
            allowNull: true 
        },
        bio: { 
            type: Sequelize.TEXT, 
            allowNull: true 
        },
        image_url: { 
            type: Sequelize.TEXT, 
            allowNull: true 
        },
        linkedin_url: { 
            type: Sequelize.STRING(500),
            allowNull: true 
        },
        certifications: { 
            type: Sequelize.JSON, 
            allowNull: true, 
            defaultValue: [] 
        },
        course_taught: { 
            type: Sequelize.INTEGER,
            allowNull: true
        },
        rating: { 
            type: Sequelize.DECIMAL(3, 2), 
            allowNull: true, defaultValue: 0 
        }
    }, 
    {
        tableName: 'instructors',
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    });
    return Instructor;
}

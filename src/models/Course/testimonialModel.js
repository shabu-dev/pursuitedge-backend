module.exports = (sequelize, Sequelize) => {

    const Testimonial = sequelize.define('Testimonial',{
        id: { 
            type: Sequelize.UUID, 
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true 
        },
        name: { 
            type: Sequelize.STRING(100), 
            allowNull: false 
        },
        role : {
            type: Sequelize.STRING(100), 
            allowNull: true 
        },
        company : {
            type: Sequelize.STRING(100), 
            allowNull: true 
        },
        content:{
            type: Sequelize.TEXT, 
            allowNull: true 
        },
        rating:{
            type: Sequelize.DECIMAL(3, 2), 
            allowNull: true, defaultValue: 0 
        },
        course : {
            type: Sequelize.STRING(100), 
            allowNull: true 
        },
        country : {
            type: Sequelize.STRING(100), 
            allowNull: true 
        },
        image_url: { 
            type: Sequelize.TEXT, 
            allowNull: true 
        },


    },
    {
        tableName: 'testimonials',
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    });

    return Testimonial;
} 
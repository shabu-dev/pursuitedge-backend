module.exports = (sequelize, DataTypes) => { 
    const Corporate = sequelize.define('Corporate', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, 
        name: { type: DataTypes.STRING(150), allowNull: false }, 
        email: { type: DataTypes.STRING(255), allowNull: false }, 
        company: { type: DataTypes.STRING(255), allowNull: false }, 
        team_size: { type: DataTypes.STRING(100), allowNull: false }, 
        courses_interested: { type: DataTypes.TEXT, allowNull: false }, 
        training_mode: { type: DataTypes.STRING(100), allowNull: false }, 
        additional_details: { type: DataTypes.TEXT, allowNull: true } }, 
        { tableName: 'corporate_enquiries', timestamps: true });
         return Corporate; 
    };
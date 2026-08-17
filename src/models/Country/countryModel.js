module.exports  = (sequelize, Sequelize) => {
    const Country = sequelize.define( 'Country', {
        id:{
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        country_name : {
            type: Sequelize.STRING(100),
            allowNull: false,
            unique: true,
        },
        country_code : {
            type: Sequelize.STRING(10),
            allowNull: false,
            unique: true,
        },
        currency:{
            type: Sequelize.STRING(5),
            allowNull: true,
            unique: true,
        },
    },
    {
        tableName: 'country',
        timestamps: true,
    });
    return Country;
}

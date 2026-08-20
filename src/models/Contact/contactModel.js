module.exports = (sequelize, Sequelize) => {

    const Contact = sequelize.define(
        'Contact',
        {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },

            firstname: {
                type: Sequelize.STRING(100),
                allowNull: false
            },

            email: {
                type: Sequelize.STRING(150),
                allowNull: false
            },

            phonenumber: {
                type: Sequelize.STRING(30),
                allowNull: false
            },

            enquiry: {
                type: Sequelize.STRING(255),
                allowNull: false
            },

            company: {
                type: Sequelize.STRING(150),
                allowNull: true
            },

            message: {
                type: Sequelize.TEXT,
                allowNull: false
            },

            status: {
                type: Sequelize.ENUM(
                    'NEW',
                    'CONTACTED',
                    'IN_PROGRESS',
                    'RESOLVED',
                    'CLOSED'
                ),
                allowNull: false,
                defaultValue: 'NEW'
            }

        },
        {
            tableName: 'contact',
            timestamps: true
        }
    );

    return Contact;
};
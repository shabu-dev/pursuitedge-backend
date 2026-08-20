module.exports = (sequelize, Sequelize) => {
    const TicketMessage = sequelize.define(
        "SupportTicketMessage",
        {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },

            ticket_id: {
                type: Sequelize.UUID,
                allowNull: false,
            },

            sender_id: {
                type: Sequelize.UUID,
                allowNull: false,
            },

            sender_type: {
                type: Sequelize.ENUM(
                    "SUPPORT",
                    "DEVELOPER",
                    "ADMIN"
                ),
                allowNull: false,
            },

            message: {
                type: Sequelize.TEXT,
                allowNull: false,
            },

            message_type: {
                type: Sequelize.ENUM(
                    "PUBLIC_MESSAGE",
                    "INTERNAL_NOTE"
                ),
                defaultValue: "PUBLIC_MESSAGE",
                allowNull: false,
            },
        },
        {
            tableName: "support_ticket_message",
            timestamps: true,
        }
    );

    return TicketMessage;
};
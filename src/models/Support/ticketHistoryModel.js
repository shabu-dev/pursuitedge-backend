module.exports = (sequelize, Sequelize) => {
    const TicketHistory = sequelize.define(
        "SupportTicketHistory",
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

            action: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },

            old_value: {
                type: Sequelize.TEXT,
                allowNull: true,
            },

            new_value: {
                type: Sequelize.TEXT,
                allowNull: true,
            },

            performed_by: {
                type: Sequelize.UUID,
                allowNull: false,
            },
        },
        {
            tableName: "support_ticket_history",
            timestamps: true,
        }
    );

    return TicketHistory;
};
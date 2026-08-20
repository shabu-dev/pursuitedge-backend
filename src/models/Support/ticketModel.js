module.exports = (sequelize, Sequelize) => {
    const Ticket = sequelize.define(
        "SupportTicket",
        {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },

            ticket_number: {
                type: Sequelize.STRING(30),
                allowNull: false,
                unique: true,
            },

            created_by: {
                type: Sequelize.UUID,
                allowNull: false,
            },

            assigned_to: {
                type: Sequelize.UUID,
                allowNull: true,
            },

            subject: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },

            description: {
                type: Sequelize.TEXT,
                allowNull: false,
            },

            category: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },

            priority: {
                type: Sequelize.ENUM(
                    "LOW",
                    "MEDIUM",
                    "HIGH",
                    "URGENT"
                ),
                defaultValue: "MEDIUM",
                allowNull: false,
            },

            status: {
                type: Sequelize.ENUM(
                    "OPEN",
                    "ASSIGNED",
                    "IN_PROGRESS",
                    "WAITING_FOR_SUPPORT",
                    "RESOLVED",
                    "CLOSED"
                ),
                defaultValue: "OPEN",
                allowNull: false,
            },

            resolved_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },

            closed_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        },
        {
            tableName: "support_ticket",
            timestamps: true,
        }
    );

    return Ticket;
};
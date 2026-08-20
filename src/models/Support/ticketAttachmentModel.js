module.exports = (sequelize, Sequelize) => {
    const TicketAttachment = sequelize.define(
        "SupportTicketAttachment",
        {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },

            message_id: {
                type: Sequelize.UUID,
                allowNull: false,
            },

            original_name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },

            stored_name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },

            mime_type: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },

            file_size: {
                type: Sequelize.BIGINT,
                allowNull: false,
            },

            file_path: {
                type: Sequelize.TEXT,
                allowNull: false,
            },

            uploaded_by: {
                type: Sequelize.UUID,
                allowNull: false,
            },
        },
        {
            tableName: "support_ticket_attachment",
            timestamps: true,
        }
    );

    return TicketAttachment;
};
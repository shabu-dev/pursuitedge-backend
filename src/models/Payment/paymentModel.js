module.exports = (sequelize, Sequelize) => {

    const Payment = sequelize.define(
        "Payment",
        {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },

            course_slug: {
                type: Sequelize.STRING,
                allowNull: true,
            },

            course_name: {
                type: Sequelize.STRING,
                allowNull: true,
            },

            customer_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            customer_email: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            customer_phone: {
                type: Sequelize.STRING,
                allowNull: true,
            },

            amount: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },

            currency: {
                type: Sequelize.STRING,
                defaultValue: "USD",
            },

            stripe_payment_intent_id: {
                type: Sequelize.STRING,
                allowNull: true,
                unique: true,
            },

            status: {
                type: Sequelize.ENUM(
                    "INITIATED",
                    "PROCESSING",
                    "SUCCESS",
                    "FAILED",
                    "CANCELLED"
                ),
                defaultValue: "INITIATED",
            },

            payment_method: {
                type: Sequelize.STRING,
                allowNull: true,
            },

            failure_reason: {
                type: Sequelize.TEXT,
                allowNull: true,
            },

            metadata: {
                type: Sequelize.JSON,
                allowNull: true,
            },
        },
        {
            tableName: "payments",
            timestamps: true,
        }
    );
    return Payment;
}


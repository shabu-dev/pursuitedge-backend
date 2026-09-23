const { Payment } = require("../models");

/**
 * Create payment
 */
const createPayment = async (data) => {

    return await Payment.create(data);

};


/**
 * Get payment by ID
 */
const getPaymentById = async (id) => {

    return await Payment.findByPk(id);

};


/**
 * Get payment by Stripe PaymentIntent ID
 */
const getPaymentByStripeIntentId = async (
    stripePaymentIntentId
) => {

    return await Payment.findOne({
        where: {
            stripe_payment_intent_id:
                stripePaymentIntentId,
        },
    });

};


/**
 * Update Stripe PaymentIntent ID
 */
const updateStripePaymentIntent = async (
    paymentId,
    stripePaymentIntentId
) => {

    return await Payment.update(
        {
            stripe_payment_intent_id:
                stripePaymentIntentId,
        },
        {
            where: {
                id: paymentId,
            },
        }
    );

};


/**
 * Update payment status
 */
const updatePaymentStatus = async (
    paymentId,
    status,
    failureReason = null
) => {

    return await Payment.update(
        {
            status,
            failure_reason: failureReason,
        },
        {
            where: {
                id: paymentId,
            },
        }
    );

};


module.exports = {
    createPayment,
    getPaymentById,
    getPaymentByStripeIntentId,
    updateStripePaymentIntent,
    updatePaymentStatus,
};
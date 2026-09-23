const stripe = require("../services/stripeService");

const paymentRepository =
    require("../repositories/paymentRepository");

const mailService =
    require("../services/mailService");

const paymentInitiatedCustomer =
    require("../emails/paymentInitiatedCustomer");

const paymentInitiatedCompany =
    require("../emails/paymentInitiatedCompany");

const paymentSuccessCustomer =
    require("../emails/paymentSuccessCustomer");

const paymentSuccessCompany =
    require("../emails/paymentSuccessCompany");

const paymentFailedCustomer =
    require("../emails/paymentFailedCustomer");

const paymentFailedCompany =
    require("../emails/paymentFailedCompany");


/**
 * CREATE PAYMENT
 */
const createPayment = async (req, res) => {

    try {

        const {
            course_id,
            course_name,
            customer_name,
            customer_email,
            customer_phone,
            amount,
            currency = "inr",
        } = req.body;


        /* ==========================
           VALIDATION
        ========================== */

        if (
            !customer_name ||
            !customer_email ||
            !amount
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Customer name, email and amount are required",
            });

        }


        if (Number(amount) <= 0) {

            return res.status(400).json({
                success: false,
                message: "Invalid payment amount",
            });

        }


        /* ==========================
           CREATE DATABASE PAYMENT
        ========================== */

        const payment =
            await paymentRepository.createPayment({

                course_id,

                course_name,

                customer_name,

                customer_email,

                customer_phone,

                amount,

                currency:
                    currency.toUpperCase(),

                status: "INITIATED",

            });


        /* ==========================
           STRIPE PAYMENT INTENT
        ========================== */

        const paymentIntent =
            await stripe.paymentIntents.create({

                amount:
                    Math.round(
                        Number(amount) * 100
                    ),

                currency:
                    currency.toLowerCase(),

                receipt_email:
                    customer_email,

                automatic_payment_methods: {
                    enabled: true,
                },

                metadata: {

                    payment_id:
                        payment.id,

                    course_id:
                        course_id || "",

                },

            });


        /* ==========================
           SAVE STRIPE ID
        ========================== */

        await paymentRepository
            .updateStripePaymentIntent(

                payment.id,

                paymentIntent.id

            );


        /* ==========================
           CUSTOMER INITIATED EMAIL
        ========================== */

        try {

            await mailService.sendMail({

                to: customer_email,

                subject:
                    "Payment Initiated",

                html:
                    paymentInitiatedCustomer({

                        customerName:
                            customer_name,

                        courseName:
                            course_name,

                        amount,

                        currency:
                            currency.toUpperCase(),

                        paymentId:
                            payment.id,

                    }),

            });

        } catch (emailError) {

            console.error(
                "Customer initiated email failed:",
                emailError.message
            );

        }


        /* ==========================
           COMPANY INITIATED EMAIL
        ========================== */

        try {

            await mailService.sendMail({

                to:
                    process.env.COMPANY_EMAIL,

                subject:
                    "New Payment Initiated",

                html:
                    paymentInitiatedCompany({

                        customerName:
                            customer_name,

                        customerEmail:
                            customer_email,

                        courseName:
                            course_name,

                        amount,

                        currency:
                            currency.toUpperCase(),

                        paymentId:
                            payment.id,

                    }),

            });

        } catch (emailError) {

            console.error(
                "Company initiated email failed:",
                emailError.message
            );

        }


        /* ==========================
           RESPONSE
        ========================== */

        return res.status(200).json({

            success: true,

            message:
                "Payment initiated successfully",

            paymentId:
                payment.id,

            clientSecret:
                paymentIntent.client_secret,

        });


    } catch (error) {

        console.error(
            "CREATE PAYMENT ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to initiate payment",

            error:
                error.message,

        });

    }

};


/**
 * GET PAYMENT
 */
const getPayment = async (req, res) => {

    try {

        const {
            id
        } = req.params;


        const payment =
            await paymentRepository
                .getPaymentById(id);


        if (!payment) {

            return res.status(404).json({

                success: false,

                message:
                    "Payment not found",

            });

        }


        return res.status(200).json({

            success: true,

            data: payment,

        });


    } catch (error) {

        console.error(
            "GET PAYMENT ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to get payment",

        });

    }

};


/**
 * STRIPE WEBHOOK
 */
const stripeWebhook = async (req, res) => {

    let event;


    try {

        const signature =
            req.headers["stripe-signature"];


        event =
            stripe.webhooks.constructEvent(

                req.body,

                signature,

                process.env
                    .STRIPE_WEBHOOK_SECRET

            );


    } catch (error) {

        console.error(
            "Stripe webhook verification failed:",
            error.message
        );


        return res.status(400).send(
            `Webhook Error: ${error.message}`
        );

    }


    try {

        switch (event.type) {


            /* =================================
               PAYMENT PROCESSING
            ================================= */

            case "payment_intent.processing": {

                const paymentIntent =
                    event.data.object;


                const paymentId =
                    paymentIntent
                        .metadata
                        ?.payment_id;


                if (paymentId) {

                    await paymentRepository
                        .updatePaymentStatus(

                            paymentId,

                            "PROCESSING"

                        );

                }


                break;
            }


            /* =================================
               PAYMENT SUCCESS
            ================================= */

            case "payment_intent.succeeded": {

                const paymentIntent =
                    event.data.object;


                const paymentId =
                    paymentIntent
                        .metadata
                        ?.payment_id;


                if (!paymentId) {

                    break;

                }


                const payment =
                    await paymentRepository
                        .getPaymentById(
                            paymentId
                        );


                if (!payment) {

                    break;

                }


                /* Update DB */

                await paymentRepository
                    .updatePaymentStatus(

                        paymentId,

                        "SUCCESS"

                    );


                /* Customer Email */

                try {

                    await mailService
                        .sendMail({

                            to:
                                payment.customer_email,

                            subject:
                                "Payment Successful",

                            html:
                                paymentSuccessCustomer({

                                    customerName:
                                        payment.customer_name,

                                    courseName:
                                        payment.course_name,

                                    amount:
                                        payment.amount,

                                    currency:
                                        payment.currency,

                                    paymentId:
                                        payment.id,

                                }),

                        });

                } catch (emailError) {

                    console.error(
                        "Success customer email failed:",
                        emailError.message
                    );

                }


                /* Company Email */

                try {

                    await mailService
                        .sendMail({

                            to:
                                process.env
                                    .COMPANY_EMAIL,

                            subject:
                                "Payment Successful",

                            html:
                                paymentSuccessCompany({

                                    customerName:
                                        payment.customer_name,

                                    customerEmail:
                                        payment.customer_email,

                                    courseName:
                                        payment.course_name,

                                    amount:
                                        payment.amount,

                                    currency:
                                        payment.currency,

                                    paymentId:
                                        payment.id,

                                }),

                        });

                } catch (emailError) {

                    console.error(
                        "Success company email failed:",
                        emailError.message
                    );

                }


                break;

            }


            /* =================================
               PAYMENT FAILED
            ================================= */

            case "payment_intent.payment_failed": {

                const paymentIntent =
                    event.data.object;


                const paymentId =
                    paymentIntent
                        .metadata
                        ?.payment_id;


                if (!paymentId) {

                    break;

                }


                const failureReason =
                    paymentIntent
                        .last_payment_error
                        ?.message ||
                    "Payment failed";


                const payment =
                    await paymentRepository
                        .getPaymentById(
                            paymentId
                        );


                if (!payment) {

                    break;

                }


                /* Update DB */

                await paymentRepository
                    .updatePaymentStatus(

                        paymentId,

                        "FAILED",

                        failureReason

                    );


                /* Customer */

                try {

                    await mailService
                        .sendMail({

                            to:
                                payment.customer_email,

                            subject:
                                "Payment Failed",

                            html:
                                paymentFailedCustomer({

                                    customerName:
                                        payment.customer_name,

                                    courseName:
                                        payment.course_name,

                                    amount:
                                        payment.amount,

                                    currency:
                                        payment.currency,

                                    paymentId:
                                        payment.id,

                                    failureReason,

                                }),

                        });

                } catch (emailError) {

                    console.error(
                        "Failed customer email failed:",
                        emailError.message
                    );

                }


                /* Company */

                try {

                    await mailService
                        .sendMail({

                            to:
                                process.env
                                    .COMPANY_EMAIL,

                            subject:
                                "Payment Failed",

                            html:
                                paymentFailedCompany({

                                    customerName:
                                        payment.customer_name,

                                    customerEmail:
                                        payment.customer_email,

                                    courseName:
                                        payment.course_name,

                                    amount:
                                        payment.amount,

                                    currency:
                                        payment.currency,

                                    paymentId:
                                        payment.id,

                                    failureReason,

                                }),

                        });

                } catch (emailError) {

                    console.error(
                        "Failed company email failed:",
                        emailError.message
                    );

                }


                break;

            }


            default:

                console.log(
                    `Unhandled Stripe event: ${event.type}`
                );

        }


        return res.json({
            received: true,
        });


    } catch (error) {

        console.error(
            "Stripe webhook processing error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Webhook processing failed",

        });

    }

};


module.exports = {

    createPayment,

    getPayment,

    stripeWebhook,

};
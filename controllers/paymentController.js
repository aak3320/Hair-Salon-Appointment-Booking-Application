const { createPaymentIntent } = require('../services/paymentService');
const { sendPaymentConfirmationEmail } = require('../utils/sendEmail');

const createPayment = async (req, res) => {
    try {

        // Get payment details from body
        const { amount, salonName, services, currency, description, customerEmail } = req.body;

        if (!amount) {
            return res.status(400).json({
                success: false,
                message: 'Provide payment amount'
            });
        }

        const descriptionText = `${salonName || 'Hair Salon'}: ${services || 'Appointment'}`;

        // Create payment intent with stripe
        const paymentIntent = await createPaymentIntent(
            amount,
            'aud',
            descriptionText
        );

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Confirms payment and sends confirmation email
const confirmPayment = async (req, res) => {
    try {

        const { paymentIntentId, salonName, services, appointmentDate,
            appointmentTime, userEmail, userName } = req.body;

        if (!paymentIntentId || !userEmail) {
            return res.status(400).json({
                success: false,
                message: 'Please providePayment intent ID and user email are required'
            });
        }

        // Vey payment intent status with stripe
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({
                success: false,
                message: 'Payment was not successful'
            });
        }

        // Send confirmation email to user
        try {
            console.log('Sending email to:', userEmail);
    console.log('Email details:', userName, salonName, services); 
            await sendPaymentConfirmationEmail(userEmail, userName, salonName, services,
                appointmentDate, appointmentTime);
                 console.log('Email sent successfully!');
        } catch (emailError) {
            console.log('Email failed:', emailError.message);
        }

        res.status(200).json({
            success: true,
            message: 'Payment confirmed and confirmation email sent'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = { createPayment, confirmPayment };
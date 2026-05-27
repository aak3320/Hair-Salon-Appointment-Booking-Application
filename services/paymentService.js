const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// create a payment service function
const createPaymentIntent = async (amount, currency, description) => {

    //converts dollars into cents
    const amountInCents = Math.round(amount * 100);

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: currency || 'aud',
        description: description || 'Hair Salon Appointment',
        automatic_payment_methods: {
            enabled: true,
        },
    });

    return paymentIntent;
};

module.exports = {createPaymentIntent};
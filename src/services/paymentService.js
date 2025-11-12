const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create payment intent with Stripe
const createPaymentIntent = async (amount) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      // Return mock payment intent if Stripe is not configured
      return {
        clientSecret: 'mock_client_secret_' + Date.now(),
        paymentIntentId: 'mock_pi_' + Date.now(),
      };
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    throw new Error(`Payment intent creation failed: ${error.message}`);
  }
};

// Verify webhook signature (simplified for Postman testing)
const verifyWebhook = (payload, signature) => {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    // For Postman testing, accept a simple token
    return payload.token === 'test_webhook_token';
  }

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    return event;
  } catch (error) {
    throw new Error(`Webhook verification failed: ${error.message}`);
  }
};

module.exports = {
  createPaymentIntent,
  verifyWebhook,
};


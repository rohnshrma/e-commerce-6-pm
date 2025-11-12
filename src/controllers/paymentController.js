const Order = require('../models/Order');
const Product = require('../models/Product');
const { verifyWebhook } = require('../services/paymentService');

// @desc    Handle payment webhook
// @route   POST /api/payments/webhook
// @access  Public (Stripe webhook)
const handleWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['stripe-signature'] || req.body.signature;
    const payload = req.body;

    // Verify webhook (simplified for Postman testing)
    // For Postman: send { token: 'test_webhook_token', orderId: '...', status: 'paid' }
    let event;
    if (payload.token === 'test_webhook_token') {
      // Mock webhook for Postman
      event = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: payload.paymentIntentId || 'mock_pi',
            status: payload.status || 'succeeded',
          },
        },
      };
    } else {
      event = verifyWebhook(payload, signature);
    }

    if (event.type === 'payment_intent.succeeded' || payload.status === 'paid') {
      const paymentIntentId = event.data?.object?.id || payload.paymentIntentId;
      const order = await Order.findOne({ paymentIntentId });

      if (order && order.paymentStatus === 'pending') {
        order.paymentStatus = 'paid';
        await order.save();

        // Update product stock
        for (const item of order.items) {
          const product = await Product.findById(item.product);
          if (product) {
            product.stock -= item.quantity;
            await product.save();
          }
        }
      }
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
};

// @desc    Mock payment endpoint (for testing without Stripe)
// @route   POST /api/payments/mock
// @access  Private/Buyer
const mockPayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    if (order.paymentStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Order already processed',
      });
    }

    order.paymentStatus = 'paid';
    await order.save();

    // Update product stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    res.json({
      success: true,
      message: 'Payment processed successfully (mock)',
      order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleWebhook,
  mockPayment,
};


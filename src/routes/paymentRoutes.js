const express = require('express');
const { body } = require('express-validator');
const { handleWebhook, mockPayment } = require('../controllers/paymentController');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/roles');
const validate = require('../middleware/validate');

const router = express.Router();

// Webhook endpoint (public, but should verify signature in production)
router.post('/webhook', handleWebhook);

// Mock payment endpoint for testing without Stripe
router.post(
  '/mock',
  authMiddleware,
  roleMiddleware('buyer'),
  [body('orderId').notEmpty().withMessage('Order ID is required')],
  validate,
  mockPayment
);

module.exports = router;


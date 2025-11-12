const express = require('express');
const { body } = require('express-validator');
const {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart,
} = require('../controllers/cartController');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/roles');
const validate = require('../middleware/validate');

const router = express.Router();

// All cart routes require buyer role
router.use(authMiddleware, roleMiddleware('buyer'));

router.get('/', getCart);

router.post(
  '/',
  [
    body('productId').notEmpty().withMessage('Product ID is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  ],
  validate,
  addToCart
);

router.put(
  '/',
  [
    body('productId').notEmpty().withMessage('Product ID is required'),
    body('quantity').isInt({ min: 0 }).withMessage('Quantity must be non-negative'),
  ],
  validate,
  updateCart
);

router.delete('/:productId', removeFromCart);
router.delete('/', clearCart);

module.exports = router;


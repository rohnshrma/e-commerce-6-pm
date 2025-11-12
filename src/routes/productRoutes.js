const express = require('express');
const { body } = require('express-validator');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/roles');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProduct);

router.post(
  '/',
  authMiddleware,
  roleMiddleware('vendor', 'admin'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('images').optional().isArray().withMessage('Images must be an array'),
  ],
  validate,
  createProduct
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('vendor', 'admin'),
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  ],
  validate,
  updateProduct
);

router.delete('/:id', authMiddleware, roleMiddleware('vendor', 'admin'), deleteProduct);

module.exports = router;


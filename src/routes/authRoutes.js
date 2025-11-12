const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['buyer', 'vendor']).withMessage('Role must be buyer or vendor'),
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Please provide a valid email')],
  validate,
  forgotPassword
);

router.post(
  '/reset-password',
  [
    body('resetToken').notEmpty().withMessage('Reset token is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  resetPassword
);

module.exports = router;


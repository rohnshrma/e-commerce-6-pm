const express = require('express');
const { body } = require('express-validator');
const {
  getMe,
  updateMe,
  getUsers,
  deleteUser,
} = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/roles');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/me', authMiddleware, getMe);
router.put(
  '/me',
  authMiddleware,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('profile.address').optional().trim(),
    body('profile.phone').optional().trim(),
  ],
  validate,
  updateMe
);

router.get('/', authMiddleware, roleMiddleware('admin'), getUsers);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteUser);

module.exports = router;


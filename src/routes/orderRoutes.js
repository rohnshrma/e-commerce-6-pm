const express = require('express');
const {
  createOrder,
  getOrders,
  getOrder,
} = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/roles');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('buyer'), createOrder);
router.get('/', authMiddleware, getOrders);
router.get('/:id', authMiddleware, getOrder);

module.exports = router;


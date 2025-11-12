const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { createPaymentIntent } = require('../services/paymentService');

// @desc    Create order from cart
// @route   POST /api/orders
// @access  Private/Buyer
const createOrder = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    // Calculate total and validate stock
    let totalAmount = 0;
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product?.title || 'product'}`,
        });
      }
      totalAmount += item.priceSnapshot * item.quantity;
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        priceSnapshot: item.priceSnapshot,
      })),
      totalAmount,
      paymentStatus: 'pending',
    });

    // Create payment intent
    const paymentInfo = await createPaymentIntent(totalAmount);

    order.paymentIntentId = paymentInfo.paymentIntentId;
    await order.save();

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
      payment: {
        clientSecret: paymentInfo.clientSecret,
        paymentIntentId: paymentInfo.paymentIntentId,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res, next) => {
  try {
    let orders;

    if (req.user.role === 'admin') {
      // Admin sees all orders
      orders = await Order.find()
        .populate('user', 'name email')
        .populate('items.product')
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'vendor') {
      // Vendor sees orders containing their products
      orders = await Order.find()
        .populate('user', 'name email')
        .populate('items.product')
        .sort({ createdAt: -1 });

      // Filter to only orders with vendor's products
      orders = orders.filter((order) =>
        order.items.some((item) => item.product.vendor.toString() === req.user._id.toString())
      );
    } else {
      // Buyer sees only their orders
      orders = await Order.find({ user: req.user._id })
        .populate('items.product')
        .sort({ createdAt: -1 });
    }

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check access
    if (req.user.role === 'buyer' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    if (req.user.role === 'vendor') {
      const hasVendorProduct = order.items.some(
        (item) => item.product.vendor.toString() === req.user._id.toString()
      );
      if (!hasVendorProduct) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this order',
        });
      }
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
};


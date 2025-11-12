const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const generateResetToken = require('../utils/resetToken');

// Store reset tokens in memory (for Postman testing)
// In production, use Redis or database
const resetTokens = new Map();

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Validate role
    const allowedRoles = ['buyer', 'vendor'];
    const userRole = allowedRoles.includes(role) ? role : 'buyer';

    // Create user
    const user = await User.create({
      name,
      email,
      passwordHash: password, // Will be hashed by pre-save hook
      role: userRole,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated',
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password (returns token for Postman testing)
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists for security
      return res.json({
        success: true,
        message: 'If user exists, reset token has been generated',
        resetToken: 'test_reset_token_' + Date.now(), // For Postman testing
      });
    }

    const resetToken = generateResetToken();
    resetTokens.set(resetToken, {
      userId: user._id,
      expiresAt: Date.now() + 3600000, // 1 hour
    });

    res.json({
      success: true,
      message: 'Reset token generated (for Postman testing)',
      resetToken, // In production, send via email
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;

    const tokenData = resetTokens.get(resetToken);
    if (!tokenData || Date.now() > tokenData.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    const user = await User.findById(tokenData.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.passwordHash = newPassword; // Will be hashed by pre-save hook
    await user.save();

    resetTokens.delete(resetToken);

    res.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};


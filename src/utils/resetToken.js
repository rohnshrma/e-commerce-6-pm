const crypto = require('crypto');

// Simple reset token generator (for Postman testing)
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

module.exports = generateResetToken;


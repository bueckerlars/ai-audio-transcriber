const jwt = require('jsonwebtoken');
const blacklist = require('../services/tokenBlacklistService');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token found' });
  }

  // Check if token is blacklisted
  if (await blacklist.isBlacklisted(token)) {
    return res.status(403).json({ error: 'Invalid token' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };

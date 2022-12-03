/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

async function auth(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, decoded) => {
    if (error) return res.status(403).json({ message: 'Forbidden' });
    const user = await User.findOne({ _id: decoded.id });
    if (!user) res.status(403).json({ message: 'Forbidden' });
    req.user = user;
    next();
  });
}

module.exports = auth;

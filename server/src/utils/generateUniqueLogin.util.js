const User = require('../models/User.model');

async function generateUniqueLogin(proposedLogin) {
  const dbUser = await User.findOne({ login: proposedLogin });
  if (dbUser) {
    proposedLogin += Math.floor(Math.random() * 100 + 1);
    generateUniqueLogin(proposedLogin);
  }
  return proposedLogin;
}

module.exports = generateUniqueLogin;

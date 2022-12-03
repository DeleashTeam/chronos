const sendEmail = require('./sendEmail');

/**
 * Sends mail confirmation email
 * @param {String} token to generate unique confirmation link
 * @param {Object} user user with email and name
 */
async function sendPasswordResetMail(token, user) {
  const link = `${process.env.CLIENT_LINK}/password-reset/${token}`;
  const context = {
    link,
    email: user.email,
    name: user.name || user.login,
  };
  sendEmail('Password Reset', 'passwordReset', context);
}

module.exports = sendPasswordResetMail;

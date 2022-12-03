const sendEmail = require('./sendEmail');
/**
 * Sends mail confirmation email
 * @param {String} token to generate unique confirmation link
 * @param {Object} user user with email and name
 */
async function sendEmailConfirmationMail(token, user) {
  const link = `${process.env.SERVER_LINK}/api/auth/confirm-email/${token}`;
  const context = {
    link,
    email: user.email,
    name: user.name || user.login,
  };
  sendEmail('Email Confirmation', 'confirmationMail', context);
}

module.exports = sendEmailConfirmationMail;

const mailer = require('../configs/mailer.transporter.config');

/**
 * @desc Sends email with given subject and template to email from ctx
 * @param {String} subject email subject
 * @param {String} template email template
 * @param {Object} ctx contains email and additional params for template
 */
async function sendEmail(subject, template, ctx) {
  mailer.sendMail({
    from: '"Chronos Team" <noreply@gmail.com>',
    to: ctx.email,
    subject,
    template,
    ctx,
  });
}

module.exports = sendEmail;

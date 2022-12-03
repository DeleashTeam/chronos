const sendEmail = require('./sendEmail');
/**
 * Sends calendar join email
 * @param {import('../models').Calendar} calendar calendar
 * @param {import('../models').User} user user
 */
async function sendEventNotificationMail(user, event) {
  const link = `${process.env.SERVER_LINK}/api/events/${event._id}`;
  const context = {
    link,
    email: user.email,
    name: user.name || user.login,
    eventName: event.name,
  };
  sendEmail('Upcoming event', 'eventNotification', context);
}



module.exports = sendEventNotificationMail;

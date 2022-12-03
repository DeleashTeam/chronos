const sendEmail = require('./sendEmail');
/**
 * Sends calendar join email
 * @param {import('../models').Calendar} calendar calendar
 * @param {import('../models').User} user user
 */
async function sendCalendarJoinMail(user, calendar) {
  const link = `${process.env.CLIENT_LINK}/calendars/join/${calendar.inviteLink}`;
  const context = {
    link,
    email: user.email,
    name: user.name || user.login,
    calendarName: calendar.name,
  };
  sendEmail('Invitation to join the calendar', 'calendarJoin', context);
}

module.exports = sendCalendarJoinMail;

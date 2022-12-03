/* eslint-disable no-await-in-loop */
const jwt = require('jsonwebtoken');
const { RRule } = require('rrule');
const { Calendar, User, Event } = require('../models');
const eventsService = require('./events.service');
const { userInList, getHolidays } = require('../utils');
const { sendCalendarJoinEmail } = require('../mailer');

const errors = Object.freeze({
  FreeCalendarLimitReached: 0,
  CalendarNotFound: 1,
  UnableToDeleteCalendar: 2,
  UnableToChangeUserList: 3,
  UnableToDeleteThisUser: 4,
  UserAlreadyAdded: 5,
  UnableToAddEvent: 6,
  UserNotFound: 7,
  UnableToChangeAdminList: 8,
  UnableToChangeCalendar: 9,
});

const defaultSelectParams = {
  pagination: {
    page: 1,
    pageSize: 5,
  },
  populated: [],
};

/**
 * @typedef {Object} SelectParameters
 * @property {{page: Number, pageSize: Number}} pagination
 * @property {String[]} populated
 * @property {Boolean} my
 * @property {String} name
 * @property {String} sort
 */

/**
 *
 * @param {import('../models').User} user
 * @param {SelectParameters} selectParameters
 */
async function getAll({ user, selectParameters = defaultSelectParams }) {
  const skip = (selectParameters.pagination.page - 1) * selectParameters.pagination.pageSize;
  const limit = selectParameters.pagination.pageSize;

  const options = { users: { $in: [user] } };
  if (selectParameters.my) options.creator = user;
  if (selectParameters.name) options.name = new RegExp(selectParameters.name, 'i');

  const sortOptions = {};
  if (selectParameters.sort === 'createdAt') sortOptions.createdAt = -1;
  if (selectParameters.sort === 'nearestEvents') {
    sortOptions['events.appointedAt'] = 1;
  }

  const calendars = await Calendar.find(options)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  const populatedFieldsWithUsers = ['creator', 'users', 'admins', 'invitedUsers'];
  if (typeof selectParameters.populated === 'string') {
    // eslint-disable-next-line no-restricted-syntax
    for (const calendar of calendars) {
      if (populatedFieldsWithUsers.includes(selectParameters.populated)) {
        // eslint-disable-next-line no-await-in-loop
        await calendar.populate(selectParameters.populated, '-passwordHash');
        // eslint-disable-next-line no-await-in-loop
      } else await calendar.populate(selectParameters.populated);
    }
  } else if (selectParameters.populated) {
    // eslint-disable-next-line no-restricted-syntax
    for (const populateField of selectParameters.populated) {
      // eslint-disable-next-line no-restricted-syntax
      for (const calendar of calendars) {
        if (populatedFieldsWithUsers.includes(populateField)) {
          await calendar.populate(populateField, '-passwordHash');
        } else await calendar.populate(populateField);
      }
    }
  }

  return { calendars };
}

async function create({ user, name, description = '' }) {
  const { calendars } = await getAll({
    user,
    selectParameters: {
      ...defaultSelectParams,
      my: true,
      pagination: {
        page: 1,
        pageSize: 7,
      },
    },
  });

  if (calendars.length === 7 && !user.premium) {
    return { error: errors.FreeCalendarLimitReached };
  }

  const calendar = new Calendar({
    name,
    description,
    creator: user,
    users: [user],
    admins: [user],
  });

  await calendar.save();

  calendar.inviteLink = jwt.sign(
    { id: calendar._id },
    process.env.JWT_CALENDAR_INVITE_LINK || 'secret key',
  );

  await calendar.save();

  return { calendar };
}

async function createDefaultCalendar(user, country) {
  const { calendar } = await create({ user, name: 'default' });
  const holidays = await getHolidays(new Date().getFullYear() - 1, country, 'uk');
  holidays.forEach(holiday => {
    const date = new Date(holiday.date);
    date.setFullYear(date.getFullYear() + 1);
    holiday.date = date;
  });
  const events = holidays.map(holiday => ({
    creatorLogin: user.login,
    creator: user,
    duration: 1,
    executorLogin: user.login,
    type: 'holiday',
    startAt: holiday.date,
    name: holiday.name,
    notification: false,
  }));
  for (const key in events) {
    addEvent({
      user,
      id: calendar._id,
      eventData: events[key],
    });
  }
}

async function get({ user, id }) {
  const calendar = await Calendar.findOne({
    users: { $in: [user] },
    _id: id,
  });

  if (!calendar) {
    return { error: errors.CalendarNotFound };
  }

  calendar.events = await Event.find({ calendar: id, users: { $in: [user] } });

  // await calendar.populate('events');
  await calendar.populate('creator', '-passwordHash');
  await calendar.populate('users', '-passwordHash');
  await calendar.populate('admins', '-passwordHash');
  await calendar.populate('invitedUsers', '-passwordHash');
  await calendar.populate('messages.author', '-passwordHash');

  return { calendar };
}

async function update({ user, id, calendarData }) {
  const { calendar, error } = await get({ user, id });
  if (error) {
    return { error };
  }

  if (!userInList(calendar.admins, user)) {
    return { error: errors.UnableToChangeCalendar };
  }

  if (calendarData.name) calendar.name = calendarData.name;
  if (calendarData.joinType) calendar.joinType = calendarData.joinType;
  if (calendarData.description) calendar.description = calendarData.description;

  await calendar.save();

  return { calendar };
}

async function remove({ user, id }) {
  const { calendar, error } = await get({
    user,
    id,
  });

  if (error) return { error };
  if (!calendar.creator.equals(user)) return { error: errors.UnableToDeleteCalendar };

  const events = await Event.find({ calendar }).populate('creator');

  // eslint-disable-next-line no-restricted-syntax
  for (const event of events) {
    await eventsService.remove({ user: event.creator, id: event._id.toString() });
  }

  await calendar.remove();

  return true;
}

async function addUser({ user, id, addingUserLogin }) {
  const { calendar, error } = await get({
    user,
    id,
  });

  if (error) return { error };

  if (!userInList(calendar.admins, user)) {
    return { error: errors.UnableToChangeUserList };
  }
  // TODO: replace with users service
  const addingUser = await User.findOne({ login: addingUserLogin });

  if (!addingUser) {
    return { error: errors.UserNotFound };
  }

  if (userInList(calendar.users, addingUser) || userInList(calendar.invitedUsers, addingUser)) {
    return { error: errors.UserAlreadyAdded };
  }

  calendar.invitedUsers.push(addingUser);

  await calendar.save();
  // TODO: send email

  sendCalendarJoinEmail(addingUser, calendar);

  return {
    calendar,
    addingUser,
  };
}

async function join({ user, token }) {
  let id;
  let calendar;
  try {
    ({ id } = jwt.decode(token, process.env.JWT_CALENDAR_INVITE_LINK || 'secret key'));
    calendar = await Calendar.findOne({ _id: id });
    if (!calendar) return { error: errors.CalendarNotFound };
  } catch (error) {
    return { error: errors.CalendarNotFound };
  }

  await calendar.populate('users');
  await calendar.populate('invitedUsers');

  if (calendar.joinType === 'invite only') {
    if (!userInList(calendar.invitedUsers, user)) {
      return { error: errors.CalendarNotFound };
    }
  }

  if (userInList(calendar.users, user)) {
    return { error: errors.UserAlreadyAdded };
  }

  calendar.users.push(user);
  calendar.invitedUsers = calendar.invitedUsers.filter(invitedUser => !invitedUser.equals(user));

  await calendar.save();

  return { calendar };
}

async function removeUser({ user, id, removingUserLogin }) {
  const { calendar, error } = await get({
    user,
    id,
  });
  if (error) return { error };

  if (user.login !== removingUserLogin && !userInList(calendar.admins, user)) {
    return { error: errors.UnableToChangeUserList };
  }

  // TODO: replace with users service
  const removingUser = await User.findOne({ login: removingUserLogin });

  if (calendar.creator.equals(removingUser)) {
    return { error: errors.UnableToDeleteThisUser };
  }
  if (!user.equals(removingUser) && userInList(calendar.admins, removingUser)) {
    return { error: errors.UnableToDeleteThisUser };
  }

  if (
    !userInList(calendar.users, removingUser)
    && !userInList(calendar.invitedUsers, removingUser)
  ) {
    return { error: errors.UserNotFound };
  }

  calendar.users = calendar.users.filter(calendarUser => !calendarUser.equals(removingUser));
  calendar.admins = calendar.users.filter(adminUser => !adminUser.equals(removingUser));
  calendar.invitedUsers = calendar.users.filter(invitedUser => !invitedUser.equals(removingUser));

  await calendar.save();

  return true;
}

/**
 *
 * @param {import('../models')} user
 * @param {String} id
 * @param {EventData} eventData
 */
async function addEvent({ user, id, eventData }) {
  const { calendar, error } = await get({
    user,
    id,
  });
  if (error) return { error };

  if (!userInList(calendar.admins, user)) {
    return { error: errors.UnableToAddEvent };
  }

  if (
    eventData.type === 'task'
    && eventData.executorLogin
    && eventData.executorLogin !== user.login
  ) {
    if (!userInList(calendar.users, await User.findOne({ login: eventData.executorLogin }))) {
      return { error: errors.UserNotFound };
    }
  }

  if (!eventData.creator) eventData.creator = user;
  eventData.calendar = calendar;

  const { event } = await eventsService.create(eventData);

  calendar.events.push(event);

  await calendar.save();

  return { calendar, event };
}

/**
 *
 * @param {} param0
 */
async function getEvents({ user, id, filters }) {
  if (filters.from && filters.to) {
    const from = new Date(filters.from);
    const to = new Date(filters.to);

    const events = await Event.find({
      calendar: id,
      users: { $in: [user] },
      $or: [
        { rrule: null, startAt: { $gte: from, $lte: to } },
        { rrule: { $ne: null }, endAt: { $gte: filters.from } },
        { rrule: { $ne: null }, endAt: null },
      ],
    });

    const filteredEvents = events.map(event => {
      const eventDates = { event, dates: [] };
      if (event.rrule) {
        const rule = RRule.fromString(event.rrule);
        eventDates.dates = rule.between(from, to);
        if (eventDates.dates.length) return eventDates;
      }
      eventDates.dates = [event.startAt];
      return eventDates;
    });

    return { events: filteredEvents };
  }
}

async function toggleAdmin({ user, id, togglingUserLogin }) {
  const { calendar, error } = await get({ user, id });

  if (error) return { error };

  if (!userInList(calendar.admins, user)) return { error: errors.UnableToChangeAdminList };
  if (calendar.creator.login === togglingUserLogin) {
    return { error: errors.UnableToDeleteThisUser };
  }

  const togglingUser = calendar.users.find(
    userInCalendar => userInCalendar.login === togglingUserLogin,
  );

  if (!togglingUser) return { error: errors.UserNotFound };

  const togglingUserIsAdmin = userInList(calendar.admins, togglingUser);
  if (togglingUserIsAdmin && !user.equals(calendar.creator)) {
    if (user.login !== togglingUserLogin) return { error: errors.UnableToDeleteThisUser };
  }

  if (togglingUserIsAdmin) {
    calendar.admins = calendar.admins.filter(admin => !admin.equals(togglingUser));
  } else {
    calendar.admins.push(togglingUser);
  }

  await calendar.save();

  return { calendar, togglingUser };
}

module.exports = {
  errors,
  getAll,
  create,
  get,
  remove,
  addUser, // TODO: add redirect
  join,
  update,
  removeUser,
  addEvent, // test this
  createDefaultCalendar,
  getEvents,
  toggleAdmin,
};

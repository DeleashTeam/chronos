const { RRule } = require('rrule');
const jwt = require('jsonwebtoken');
const { Event, User, Calendar } = require('../models');
const { userInList } = require('../utils');
const scheduleSystem = require('../utils/scheduleSystem.util');

const errors = Object.freeze({
  ZeroError: 0,
  UnableToDeleteEvent: 1,
  UnableToChangeUserList: 2,
  UnableToDeleteThisUser: 3,
  UserAlreadyAdded: 4,
  UserNotFound: 5,
  UnableToChangeEvent: 6,
  EventNotFound: 7,
  UnableToChangeAdminList: 8,
});

function stringToRRuleFrequency(range) {
  if (!(range in ['day', 'week', 'month', 'year'])) {
    throw new Error('Error frequency range');
  }

  if (range === 'day') return RRule.DAILY;
  if (range === 'week') return RRule.WEEKLY;
  if (range === 'month') return RRule.MONTHLY;
  if (range === 'year') return RRule.YEARLY;
  return null;
}

/**
 * @typedef { {
 *   creatorLogin: String,
 *   name: String,
 *   executorLogin: String,
 *   color: String,
 *   type: String,
 *   startAt: Date,
 *   endAt: Date,
 *   rrule: String,
 *   duration: Number,
 *   calendar: import('../models/Calendar.model'),
 *   frequency: { range: String, count: Number }
 * } } EventData
 */

/**
 *
 * @param {EventData} eventData
 */
async function loadEventData(eventData) {
  const loadedEventData = { ...eventData };
  // TODO: replace with user service
  // loadedEventData.creator = await User.findOne({ login: eventData.creatorLogin });
  if (eventData.executorLogin && eventData.creator.login !== eventData.executorLogin) {
    loadedEventData.executor = await User.findOne({ login: eventData.executorLogin });
    loadedEventData.executor.passwordHash = undefined;
  } else if (eventData.type === 'task') {
    loadedEventData.executor = eventData.creator;
    loadedEventData.executor.passwordHash = undefined;
  }

  delete loadedEventData.creatorLogin;
  delete loadedEventData.executorLogin;

  loadedEventData.startAt = new Date(eventData.startAt);
  if (eventData.endAt) loadedEventData.endAt = new Date(eventData.endAt);

  if (eventData.notification) loadedEventData.notification = Boolean(eventData.notification);

  return loadedEventData;
}

async function create(eventData) {
  const loadedEventData = await loadEventData(eventData);

  const defaultMembers = [loadedEventData.creator];

  if (eventData.type === 'task' && !eventData.creator.equals(loadedEventData.executor)) {
    defaultMembers.push(loadEventData.executor);
  }

  const event = new Event({
    ...loadedEventData,
    users: defaultMembers,
    admins: defaultMembers,
  });

  if (eventData.frequency) {
    const freq = stringToRRuleFrequency(eventData.frequency.range);
    const rule = new RRule({
      freq,
      interval: eventData.frequency.count,
      dtstart: eventData.appointedAt,
    });

    event.rrule = rule.toString();
  }
  event.inviteLink = jwt.sign({ id: event._id }, process.env.JWT_EVENT_INVITE_LINK || 'secret key');

  await event.save();

  if (event.notification) {
    scheduleSystem.scheduleSystem.add(event, () => {
      scheduleSystem.defaultCallback(event);
    });
  }

  return { event };
}

/**
 *
 * @param {import('../models').User} user
 * @param {String} id
 */
async function get({ user, id }) {
  const event = await Event.findOne({
    users: {
      $in: [user],
    },
    _id: id,
  })
    .populate('creator', '-passwordHash')
    .populate('executor', '-passwordHash')
    .populate('admins', '-passwordHash')
    .populate('users', '-passwordHash')
    .populate('messages.author', '-passwordHash');

  if (!event) {
    return { error: errors.EventNotFound };
  }

  return { event };
}

/**
 *
 * @param { {id: String, eventData: EventData} } param0
 */
async function update({ user, id, eventData }) {
  const { event, error } = await get({ user, id });
  if (error) return { error };

  if (!userInList(event.admins, user)) {
    return { error: errors.UnableToChangeEvent };
  }

  if (eventData.name) event.name = eventData.name;
  if (eventData.executorLogin && eventData.executorLogin !== event.executor.login) {
    const newExecutor = await User.findOne({ login: eventData.executorLogin });
    const { error: getCalendarError } = await calendarsService.get(newExecutor, event.calendar.id);
    if (typeof getCalendarError === 'number') return { error: errors.UserNotFound };
    event.executor = newExecutor;
  }
  if (eventData.color) event.color = eventData.color;
  if (eventData.type) event.type = eventData.type;
  if (eventData.startAt) {
    event.startAt = eventData.startAt;
    if (event.rrule) {
      const rrule = RRule.fromString(event.rrule);
      rrule.options.dtstart = event.startAt;
      event.rrule = rrule.toString();
    }
    scheduleSystem.scheduleSystem.update(event, () => scheduleSystem.defaultCallback(event));
  }
  if (eventData.endAt) event.endAt = eventData.endAt;
  if (eventData.duration) event.duration = eventData.duration;
  if (eventData.rrule) {
    event.rrule = eventData.rrule;
    scheduleSystem.scheduleSystem.update(event, () => scheduleSystem.defaultCallback(event));
  }

  if (eventData.notification !== undefined) {
    event.notification = eventData.notification;
    if (typeof eventData.notification === 'string' && eventData.notification === 'true') {
      scheduleSystem.scheduleSystem.add(event, () => scheduleSystem.defaultCallback(event));
    } else {
      scheduleSystem.scheduleSystem.remove(event);
    }
  }
  if (eventData.description) event.description = eventData.description;

  await event.save();

  return { event };
}

async function remove({ user, id }) {
  const { event, error } = await get({
    user,
    id,
  });

  if (error) return { error };
  if (!event.creator.equals(user)) return { error: errors.UnableToDeleteEvent };

  scheduleSystem.scheduleSystem.remove(event);

  const calendar = await Calendar.findById(event.calendar);
  calendar.events = calendar.events.filter(calendarEvent => !calendarEvent.equals(event._id));

  await event.remove();
  await calendar.save();

  return true;
}

async function addUser({ user, id, addingUserLogin }) {
  const { event, error } = await get({
    user,
    id,
  });

  if (error) return { error };

  if (!userInList(event.admins, user)) {
    return { error: errors.UnableToChangeUserList };
  }
  // TODO: replace with users service
  const addingUser = await User.findOne({ login: addingUserLogin });

  if (!addingUser) return { error: errors.UserNotFound };

  const calendar = await Calendar.findOne({
    users: { $in: [addingUser] },
    _id: event.calendar,
  });

  if (!calendar) return { error: errors.UserNotFound };

  if (userInList(event.users, addingUser)) {
    return { error: errors.UserAlreadyAdded };
  }

  event.users.push(addingUser);

  await event.save();

  return {
    event,
    addingUser,
  };
}

async function removeUser({ user, id, removingUserLogin }) {
  const { event, error } = await get({
    user,
    id,
  });
  if (error) return { error };

  if (!userInList(event.admins, user)) {
    if (user.login !== removingUserLogin) {
      return { error: errors.UnableToChangeUserList };
    }
  }

  // TODO: replace with users service
  const removingUser = await User.findOne({ login: removingUserLogin });

  if (event.creator.equals(removingUser)) {
    return { error: errors.UnableToDeleteThisUser };
  }
  if (!user.equals(removingUser) && userInList(event.admins, removingUser)) {
    return { error: errors.UnableToDeleteThisUser };
  }

  event.users = event.users.filter(eventUser => !eventUser.equals(removingUser));
  event.admins = event.users.filter(adminUser => !adminUser.equals(removingUser));

  await event.save();

  return true;
}

async function toggleAdmin({ user, id, togglingUserLogin }) {
  const { event, error } = await get({ user, id });

  if (error) return { error };

  if (!userInList(event.admins, user)) return { error: errors.UnableToChangeAdminList };
  if (event.creator.login === togglingUserLogin) {
    return { error: errors.UnableToDeleteThisUser };
  }

  const togglingUser = event.users.find(
    userInCalendar => userInCalendar.login === togglingUserLogin,
  );

  if (!togglingUser) return { error: errors.UserNotFound };

  const togglingUserIsAdmin = userInList(event.admins, togglingUser);
  if (togglingUserIsAdmin && !user.equals(event.creator)) {
    if (user.login !== togglingUserLogin) return { error: errors.UnableToDeleteThisUser };
  }

  if (togglingUserIsAdmin) {
    event.admins = event.admins.filter(admin => !admin.equals(togglingUser));
  } else {
    event.admins.push(togglingUser);
  }

  await event.save();

  return { event, togglingUser };
}

async function join({ user, token }) {
  let id;
  let event;
  try {
    ({ id } = jwt.decode(token, process.env.JWT_EVENT_INVITE_LINK || 'secret key'));
    event = await Event.findOne({ _id: id });
    if (!event) return { error: errors.EventNotFound };
  } catch (error) {
    return { error: errors.EventNotFound };
  }

  const calendar = await Calendar.findOne({
    _id: event.calendar,
    users: { $in: [user] },
  });

  await event.populate('users', '-passwordHash');

  if (!calendar) {
    return { error: errors.EventNotFound };
  }

  if (userInList(event.users, user)) {
    return { error: errors.UserAlreadyAdded };
  }

  event.users.push(user);

  await event.save();

  return { event };
}

module.exports = {
  errors,
  create, // test this
  get, // test this
  remove, // test this
  addUser, // test this
  removeUser, // test this
  update,
  toggleAdmin,
  join,
};

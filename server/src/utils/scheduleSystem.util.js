const { RRule } = require('rrule');
const fs = require('fs');
const { scheduleJob } = require('node-schedule-rrule');
const schedule = require('./scheduler.util');
const { Event } = require('../models');
const { sendEventNotificationMail } = require('../mailer');

class ScheduleSystem {
  constructor() {
    this.storage = new Map();
  }

  add(event, callback) {
    let { rrule } = event;
    if (!rrule) {
      rrule = new RRule({ dtstart: event.startAt, freq: RRule.MINUTELY, count: 2 }).toString();
    }
    const job = scheduleJob(rrule, callback);
    if (job) {
      this.storage.set(event._id.toString(), job);
      this.log('add', event, rrule);
    }
    return job;
  }

  remove(event) {
    const job = this.storage.get(event._id.toString());
    if (job) {
      job.cancel();
      this.storage.delete(event._id.toString());
      this.log('remove', event);
    }
  }

  update(event, callback) {
    const job = this.storage.get(event._id.toString());
    if (job) job.cancel();
    this.add(event, callback);
  }

  async log(type, event, rrule) {
    await fs.promises.appendFile(
      './schedules.txt',
      `${type}: ${event._id}: ${event.name}: ${rrule || ''}\n`,
    );
  }
}

/**
 * @type {ScheduleSystem}
 */
const scheduleSystem = null;

/**
 *
 * @param {*} events
 * @param {[]} callbacks
 */
function init(events, callbacks) {
  module.exports.scheduleSystem = new ScheduleSystem();
  events.forEach((event, index) => module.exports.scheduleSystem.add(event, callbacks[index]));
}

function defaultCallback(event) {
  event.users.forEach(user => {
    sendEventNotificationMail(user, event);
  });
}

async function defaultInit() {
  const now = new Date();
  try {
    await fs.promises.rm('./schedules.txt');
  } catch (error) {}
  const events = await Event.find({
    $or: [{ endAt: null, startAt: { $gte: now } }, { endAt: { $gte: now } }],
    notification: true,
  });

  const callbacks = events.map(event => () => {
    defaultCallback(event);
  });

  init(events, callbacks);
}

module.exports = {
  ScheduleSystem,
  scheduleSystem,
  init,
  defaultInit,
  defaultCallback,
};

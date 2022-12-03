const { RRule } = require('rrule');
const { scheduleJob } = require('node-schedule-rrule');

function fixRRuleString(rruleString) {
  const rule = RRule.fromString(rruleString);
  const newDate = new Date(rule.options.dtstart);
  switch (rule.options.freq) {
    case RRule.YEARLY:
      newDate.setFullYear(newDate.getFullYear - 1);
      break;
    case RRule.MONTHLY:
      newDate.setMonth(newDate.getMonth() - 1);
      break;
    case RRule.WEEKLY:
      newDate.setDate(newDate.getDate() - 7);
      break;
    case RRule.DAILY:
      newDate.setDate(newDate.getDate() - 1);
      break;
    case RRule.HOURLY:
      newDate.setHours(newDate.getHours() - 1);
      break;
    case RRule.MINUTELY:
      newDate.setMinutes(newDate.getMinutes() - 1);
      break;
    case RRule.SECONDLY:
      newDate.setSeconds(newDate.getSeconds() - 1);
      break;
    default:
      break;
  }
  rule.options.dtstart = newDate;
  return new RRule({
    ...rule.options,
    dtstart: newDate,
  }).toString();
}

/**
 * @desc Schedules the given job using the rrule string to set appointed time
 * @param {*} rruleString rrule string to set the appointed time and frequency
 * @param {*} job function to execute once the time comes
 */
const schedule = (rruleString, job) => scheduleJob(fixRRuleString(rruleString), job);

module.exports = schedule;

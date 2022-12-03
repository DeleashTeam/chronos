const { Schema, model } = require('mongoose');
const modelEquals = require('../utils/modelEquals.util');

const EventSchema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    executor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    color: {
      type: String,
      enum: [
        '#D50000',
        '#E67C73',
        '#F4511E',
        '#F6BF26',
        '#33B679',
        '#0B8043',
        '#039BE5',
        '#3F51B5',
        '#7986CB',
        '#8E24AA',
        '#616161',
      ],
      default: '#039BE5',
    },
    type: {
      type: String,
      enum: ['arrangement', 'holiday', 'reminder', 'task'],
      default: 'reminder',
    },
    startAt: {
      type: Schema.Types.Date,
      required: true,
    },
    endAt: {
      type: Schema.Types.Date,
      default: null,
    },
    duration: {
      // event duration in seconds
      type: Number,
      required: true,
    },
    rrule: {
      type: String,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    admins: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    calendar: {
      type: Schema.Types.ObjectId,
      ref: 'Calendar',
    },
    notification: {
      type: Schema.Types.Boolean,
      default: true,
    },
    messages: [
      {
        text: {
          type: String,
          required: true,
        },
        author: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        sendTime: {
          type: Schema.Types.Date,
          required: true,
        },
      },
    ],
    inviteLink: {
      type: String,
    },
    description: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

EventSchema.methods.equals = modelEquals;

const EventModel = model('Event', EventSchema);

/**
 *
 * @param {import('./User.model')} user
 */
EventModel.findCreatedBy = async user => EventModel.find({ creator: user });

/**
 *
 * @param {import('./User.model')} user
 */
EventModel.findAvailableFor = async user => EventModel.find({ users: [{ $in: user }] });

/**
 *
 * @param {import('./User.model')} user
 */
EventModel.findAdminIs = async user => EventModel.find({ admins: [{ $in: user }] });

/**
 *
 * @param {import('./User.model')} user
 */
EventModel.findExecutorIs = async user => EventModel.find({ executor: user });

module.exports = EventModel;

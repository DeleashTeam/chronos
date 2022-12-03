const { Schema, model } = require('mongoose');

const CalendarSchema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
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
    invitedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    events: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Event',
      },
    ],
    joinType: {
      type: String,
      enum: ['everyone', 'invited only'],
      default: 'everyone',
    },
    inviteLink: {
      type: String,
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
    description: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

const CalendarModel = model('Calendar', CalendarSchema);

/**
 *
 * @param {import('./User.model')} user
 */
CalendarModel.findCreatedBy = async user => CalendarModel.find({ creator: user });

/**
 *
 * @param {import('./User.model')} user
 */
CalendarModel.findAvailableFor = async user => CalendarModel.find({ users: [{ $in: user }] });

/**
 *
 * @param {import('./User.model')} user
 */
CalendarModel.findAdminIs = async user => CalendarModel.find({ admins: [{ $in: user }] });

module.exports = CalendarModel;

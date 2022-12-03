/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const { User, Event, Calendar } = require('../models');

const socketUsers = new Map();
const socketRooms = new Map();

/**
 *
 * @param {import('socket.io').Server} io
 */
function setup(io) {
  io.on('connection', socket => {
    socket.on('disconnect', () => {
      const user = socketUsers.get(socket.id);
      if (user) console.log(`user: ${user.login} disconnected`);
      socketUsers.delete(socket.id);
      socketRooms.delete(socket.id);
    });
    socket.on('handshake', async data => {
      if (data.token) {
        try {
          const { id } = jwt.verify(data.token, process.env.ACCESS_TOKEN_SECRET);

          const user = await User.findById(id, ['-passwordHash']);
          console.log(`user ${user.login} connected`);

          socketUsers.set(socket.id, user);
          socket.emit('successful handshake');
        } catch (err) {
          socket.emit('clientError', { type: 'Handshake error' });
        }
      } else {
        socket.emit('clientError', { type: 'Handshake error' });
      }
    });

    socket.on('joinRoom', async data => {
      console.log('join room');
      if (data.eventId || data.calendarId) {
        const id = data.eventId || data.calendarId;
        socket.join(id);
        const previousRoom = socketRooms.get(socket.id);
        if (previousRoom) socket.leave(id);
        socketRooms.set(socket.id, id);
      }
    });

    socket.on('leaveRoom', async data => {
      if (data.eventId || data.calendarId) {
        const id = data.eventId || data.calendarId;
        socket.leave(id);
        socketRooms.delete(socket.id);
      }
    });

    socket.on('send', async data => {
      const user = socketUsers.get(socket.id);
      if (!user) {
        socket.emit('clientError', { type: 'Handshake error' });
      } else {
        console.log(`user: ${user.login} send message`);
      }
      const sendTime = new Date();
      if (user && data.text && (data.eventId || data.calendarId)) {
        (async () => {
          let model = null;
          if (data.eventId) {
            model = await Event.findById(data.eventId);
          } else if (data.calendarId) {
            model = await Calendar.findById(data.calendarId);
          }
          // TODO: user can be update - does it updated into messages?
          model.messages.push({ text: data.text, author: user, sendTime });
          await model.save();
        })();
        const room = socketRooms.get(socket.id);
        console.log(room);
        const key = (() => {
          if (data.eventId) return 'eventId';
          if (data.calendarId) return 'calendarId';
          return '';
        })();
        io.to(room).emit('new message', {
          [key]: room,
          message: { text: data.text, author: user, sendTime },
        });
      }
    });
  });
}

module.exports = {
  setup,
};

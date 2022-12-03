import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import React, { useContext, useEffect } from 'react';
import { Flowbite } from 'flowbite-react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import io from 'socket.io-client';

import Header from './components/Header/Header';
import { selectCurrentToken, selectIsAuthenticated } from './features/auth/auth.slice';
import { selectCalendar, getCalendar } from './features/calendars/calendars.slice';
import useRoutes from './routes';
import Footer from './components/Footer';
import config from './config';
import SocketContext from './app/SocketContext';
import { getMessages } from './features/event/event.slice';

const socket = io(config.SOCKET_URL);

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = useSelector(selectCurrentToken);
  const calendar = useSelector(selectCalendar);
  const routes = useRoutes(isAuthenticated);
  const socketContext = useContext(SocketContext);
  const { messages: eventMessages, eventId } = useSelector((state) => state.event);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on('connect', () => {
      socketContext.socket = socket;
      socket.emit('handshake', { token });
    });

    socket.on('disconnect', () => {
      socketContext.socket = socket;
    });

    socket.on('successful handshake', () => {
      console.log('successful handshake');
    });

    socket.on('clientError', (data) => {
      if (data.type === 'Handshake error') {
        socket.emit('handshake', { token });
      }
    });

    socket.on('new message', (data) => {
      if (eventId && data.eventId === eventId) {
        dispatch(getMessages({ messages: eventMessages.concat(data.message) }));
      }
      // eslint-disable-next-line no-underscore-dangle
      if (calendar && data.calendarId === calendar?._id) {
        dispatch(
          getCalendar({
            calendar: {
              ...calendar,
              messages: calendar.messages.concat(data.message),
            },
          }),
        );
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('easy');
      socket.off('successful handshake');
      socket.off('clientError');
    };
  });

  return (
    <SocketContext.Provider value={{ socket }}>
      <Flowbite theme={{ dark: true }}>
        <div>
          <ToastContainer />
          <Router>
            <Header />
            {routes}
            <Footer />
          </Router>
        </div>
      </Flowbite>
    </SocketContext.Provider>
  );
}

export default App;

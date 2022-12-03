/* eslint-disable no-underscore-dangle */
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RRule } from 'rrule';
import Year from './Year';
import Toolbar from './Toolbar';
import EventCreationModal from './EventCreationModal';
import { useUpdateEventMutation } from '../../features/event/eventApi.slice';
import SocketContext from '../../app/SocketContext';
import CardLoader from '../CardLoader';

const localizer = momentLocalizer(moment);
localizer.formats.yearHeaderFormat = 'YYYY';
localizer.formats.dayHeaderFormat = 'dddd MMMM DD';
const DnDCalendar = withDragAndDrop(Calendar);

const getEvents = (events) => {
  if (events) {
    return events.reduce((acc, event) => {
      if (event.rrule) {
        const dates = RRule.fromString(event.rrule).all();
        return acc.concat(
          dates.map((date) => ({
            id: event._id,
            type: event.type,
            start: moment(date).toDate(),
            allDay: event.type === 'holiday',
            end: moment(date)
              .add(event.duration, 'seconds')
              .toDate(),
            title: event.name,
            color: event.color,
          })),
        );
      }
      return acc.concat([
        {
          id: event._id,
          type: event.type,
          start: moment(event.startAt).toDate(),
          allDay: event.type === 'holiday',
          end: moment(event.startAt)
            .add(event.duration, 'seconds')
            .toDate(),
          title: event.name,
          color: event.color,
        },
      ]);
    }, []);
  }
  return [];
};

const getToSend = (event) => {
  const {
    _id,
    creator,
    users,
    admins,
    calendar,
    messages,
    inviteLink,
    createdAt,
    updatedAt,
    executor,
    __v,
    ...toSend
  } = event;
  return toSend;
};

const MyCalendar = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(Views.MONTH);
  const { socket } = useContext(SocketContext);
  const [eventDates, setEventDates] = useState(null);
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [showEventCreation, setShowEventCreation] = useState(false);
  const [updateEvent, { isError: isUpdateError }] = useUpdateEventMutation();

  const onView = useCallback((newView) => setView(newView), [setView]);
  const fullCalendar = useSelector((state) => state.calendars.calendar);
  const onNavigate = useCallback((newDate) => setDate(newDate), [setDate]);

  const { views } = useMemo(() => ({
    views: {
      year: Year,
      month: true,
      week: true,
      day: true,
    },
  }));
  const onEventResize = async (data) => {
    const {
      start, end, event, isAllDay,
    } = data;
    const idx = events.findIndex((ev) => ev.id === event.id);
    await updateEvent({
      id: event.id,
      body: {
        ...getToSend(fullCalendar.events.find((e) => e._id === event.id)),
        startAt: start,
        duration: (new Date(end).getTime() - new Date(start).getTime()) / 1000,
        endAt: event.endAt,
      },
    });
    if (!isUpdateError) {
      events[idx].start = start;
      events[idx].end = end;
      events[idx].allDay = isAllDay;
      setEvents([...events]);
    }
  };

  const eventPropGetter = useCallback((event) => ({
    ...(event.color && { style: { backgroundColor: event.color } }),
  }));

  const dayPropGetter = useCallback((day) => ({
    ...(new Date().toDateString() === new Date(day).toDateString() && {
      style: { backgroundColor: '#fdba74' },
    }),
  }));

  const onSelectSlot = useCallback((dates) => {
    setEventDates({ start: dates.start, end: dates.end });
    setShowEventCreation(!showEventCreation);
  }, []);

  useEffect(() => {
    setEvents(getEvents(fullCalendar?.events));
  }, [fullCalendar]);

  useEffect(() => {
    if (fullCalendar && !joinedRoom) {
      socket.emit('joinRoom', { calendarId: fullCalendar._id });
      setJoinedRoom(true);
    }
    return () => {
      socket.emit('leaveRoom', { calendarId: fullCalendar?._id });
    };
  }, []);

  return (
    <>
      {fullCalendar ? (
        <div>
          <EventCreationModal
            dates={eventDates}
            id={fullCalendar._id}
            show={showEventCreation}
            setShow={setShowEventCreation}
          />
          <DnDCalendar
            localizer={localizer}
            defaultDate={new Date()}
            defaultView="month"
            onEventResize={onEventResize}
            onEventDrop={onEventResize}
            eventPropGetter={eventPropGetter}
            onSelectEvent={(event) => {
              navigate(`/event/${event.id}`);
            }}
            onSelectSlot={onSelectSlot}
            dayPropGetter={dayPropGetter}
            resizable
            selectable
            messages={{ year: 'Year' }}
            views={views}
            onView={onView}
            onNavigate={onNavigate}
            date={date}
            view={view}
            events={events}
            components={{
              toolbar: (props) => (
                <Toolbar
                  show={showEventCreation}
                  setShow={setShowEventCreation}
                  setDates={setEventDates}
                  setEvents={setEvents}
                  events={getEvents(fullCalendar?.events)}
                  {...props}
                />
              ),
              onView,
              onNavigate,
            }}
            className="bg-white border-none rounded-md lg:w-full sm:w-full"
            style={{ height: '90vh' }}
          />
        </div>
      ) : (
        <CardLoader />
      )}
    </>
  );
};

export default MyCalendar;

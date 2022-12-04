/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
import { useEffect, useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import { Button, Card } from 'flowbite-react';
import { MdArrowBack, MdChatBubble, MdSpeakerNotesOff } from 'react-icons/md';
import { FaCog } from 'react-icons/fa';
import {
  useGetEventMutation,
  useRemoveEventMutation,
  useRemoveEventUserMutation,
} from '../features/event/eventApi.slice';
import CardLoader from '../components/CardLoader';
import UserCard from '../components/calendar/UserCard';
import SocketContext from '../app/SocketContext';
import Chat from '../components/event/chat/Chat';
import Users from '../components/calendar/Users';
import InvitationLink from '../components/InvitationLink';
import ConfirmationModal from '../components/calendar/ConfirmationModal';

momentDurationFormatSetup(moment);

const Event = ({ event, removeEvent, authed }) => {
  const navigate = useNavigate();
  const [removeEventUser] = useRemoveEventUserMutation();
  return (
    <div className="flex flex-col h-full w-full gap-2">
      <div className="flex justify-between text-white h-full items-center mb-5 border-b-gray-500 border-b-2 justify-items-center">
        <span className="text-3xl">{event.name}</span>
        <div className="flex flex-col gap-2 justify-center justify-items-center">
          <span style={{ color: event.color }}>{event.type}</span>
          <span className="text-gray-600">{`${moment(event.startAt).fromNow()}`}</span>
          <span className="text-gray-600">{`for ${moment
            .duration(event.duration, 'seconds')
            .format('D [days] h [hours] m [minutes]')}`}</span>
        </div>
      </div>
      <div className="flex flex-row justify-between justify-items-center items-center">
        <span className="text-white text-xl text-center">Creator</span>
        {event && event.creator && (
          <UserCard className="border-2 border-gray-700 w-1/2 bg-gray-800" user={event.creator} />
        )}
      </div>
      <Card>
        <span className="text-gray-500 text-center whitespace-pre-line text-2xl">Description</span>
        <p className="text-white">{event.description}</p>
      </Card>
      {event && event.type === 'task' && (
        <div className="flex flex-row justify-between justify-items-center items-center">
          <span className="text-white text-xl text-center">Executor</span>
          {event && event.executor && (
            <UserCard
              className="border-2 border-gray-700 w-1/2 bg-gray-800"
              user={event.executor}
            />
          )}
        </div>
      )}

      {event && event.admins && (
        <>
          <InvitationLink token={event.inviteLink} type="event" />
          <div className="flex gap-2">
            <Users settings={true} type="event" title="Admins" users={event.admins} />
            <Users
              settings={true}
              type="event"
              adder={true}
              userClassName="w-full"
              title="Users"
              users={event.users}
            />
          </div>
        </>
      )}
      {event.creator.login === authed.login ? (
        <ConfirmationModal action={removeEvent} title="Delete Event" />
      ) : (
        <ConfirmationModal
          action={() => {
            removeEventUser({ id: event._id, login: authed.login });
            navigate(-1);
          }}
          title="Leave Event"
        />
      )}
    </div>
  );
};

const EventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [getEvent, { isLoading, isSuccess, isError }] = useGetEventMutation();
  const [removeEvent] = useRemoveEventMutation();
  const { event } = useSelector((state) => state.event);
  const { messages } = useSelector((state) => state.event);
  const { user: authed } = useSelector((state) => state.auth);
  const [joinedRoom, setJoinedRoom] = useState(false);
  const { socket } = useContext(SocketContext);
  const [showChat, setShowChat] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);

  const onRemoveEvent = () => {
    removeEvent(event._id);
    navigate(-1);
  };

  useEffect(() => {
    getEvent(eventId);
    if (!joinedRoom) {
      socket.emit('joinRoom', { eventId });
      setJoinedRoom(true);
    }
    return () => {
      socket.emit('leaveRoom', { eventId });
    };
  }, []);

  useEffect(() => {
    if (!isLoading && isError && !isSuccess) navigate('/calendars');
  }, [isLoading]);

  return (
    <div className="flex justify-between flex-col-reverse lg:flex-row">
      <div className="flex w-full lg:rounded-l-xl lg:w-1/2 h-full justify-center items-center">
        {isLoading || !isSuccess || !event ? (
          <CardLoader />
        ) : (
          <div className="flex gap-4 flex-col w-full m-5 p-10 rounded-xl bg-gray-900 justify-items-center">
            <div className="flex justify-between justify-items-center items-center">
              <Button
                onClick={() => {
                  navigate(-1);
                }}
              >
                <MdArrowBack /> Back
              </Button>
              <span className="text-gray-700 text-center text-lg">{event.name}</span>
              <div className="flex flex-row">
                <Button>
                  <FaCog size={20} />
                </Button>
                <Button
                  className="lg:hidden block text-white"
                  color={showChat ? 'failure' : 'info'}
                  onClick={() => setShowChat(!showChat)}
                >
                  {showChat ? <MdSpeakerNotesOff size={20} /> : <MdChatBubble size={20} />}
                </Button>
              </div>
            </div>
            <div className={`lg:hidden ${showChat ? '' : 'hidden'}`}>
              <div className="h-screen">
                <Chat messages={messages} eventId={event?._id} />
              </div>
            </div>
            <div className={`lg:block ${showChat ? 'hidden' : ''}`}>
              <div className='h-full'>
                <Event authed={authed} removeEvent={onRemoveEvent} event={event} />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="lg:flex hidden gap-4 flex-col w-1/2 m-5 p-10 rounded-xl bg-gray-900 justify-items-center">
        <Chat messages={messages} eventId={event?._id} />
      </div>
    </div>
  );
};
export default EventPage;

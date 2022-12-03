import { useSelector } from 'react-redux';
import ChatInput from './ChatInput';
import ChatMessages from './ChatMessages';
import { selectAuthenticatedUser } from '../../../features/auth/auth.slice';

import './chat.css';

function Chat({ messages = [], eventId, calendarId }) {
  const user = useSelector(selectAuthenticatedUser);

  return (
    <div className="sm:p-6 justify-between bg-gray-800 rounded-xl flex h-full shadow-inner flex-col">
      <ChatMessages user={user} messages={messages} />
      {eventId && <ChatInput eventId={eventId} />}
      {calendarId && <ChatInput calendarId={calendarId} />}
    </div>
  );
}

export default Chat;

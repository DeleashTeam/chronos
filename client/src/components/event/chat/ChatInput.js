/* eslint-disable no-underscore-dangle */
import { useContext, useState } from 'react';
import SocketContext from '../../../app/SocketContext';

function ChatInput({ eventId, calendarId }) {
  const { socket } = useContext(SocketContext);
  const [text, setText] = useState('');

  function onSend(e) {
    e.preventDefault();
    if (eventId) {
      socket.emit('send', { text, eventId });
    } else if (calendarId) {
      socket.emit('send', { text, calendarId });
    }
    setText('');
  }

  return (
    <div className="relative flex w-full mt-12">
      <span className="absolute bottom-0 flex items-center w-full">
        <form className="w-full">
          <label htmlFor="chat" className="sr-only">
            Your message
          </label>
          <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
            <textarea
              id="chat"
              rows="1"
              className="block resize-none mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Your message..."
              onChange={(e) => setText(e.target.value)}
              value={text}
            ></textarea>
            <button
              type="submit"
              className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
              onClick={onSend}
            >
              <svg
                aria-hidden="true"
                className="w-6 h-6 rotate-90"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
              </svg>
              <span className="sr-only">Send message</span>
            </button>
          </div>
        </form>
      </span>
    </div>
  );
}

export default ChatInput;

import { useEffect, useRef } from 'react';
import { RiEmotionUnhappyFill } from 'react-icons/ri';
import ChatMessage from './ChatMessage';

if (!Element.prototype.scrollIntoViewIfNeeded) {
  Element.prototype.scrollIntoViewIfNeeded = function (centerIfNeeded) {
    // eslint-disable-next-line no-param-reassign
    centerIfNeeded = arguments.length === 0 ? true : !!centerIfNeeded;

    const parent = this.parentNode;
    const parentComputedStyle = window.getComputedStyle(parent, null);
    // eslint-disable-next-line radix
    const parentBorderTopWidth = parseInt(parentComputedStyle.getPropertyValue('border-top-width'));
    // eslint-disable-next-line radix
    const parentBorderLeftWidth = parseInt(
      parentComputedStyle.getPropertyValue('border-left-width'),
    );
    const overTop = this.offsetTop - parent.offsetTop < parent.scrollTop;
    const overBottom = this.offsetTop - parent.offsetTop + this.clientHeight - parentBorderTopWidth
      > parent.scrollTop + parent.clientHeight;
    const overLeft = this.offsetLeft - parent.offsetLeft < parent.scrollLeft;
    const overRight = this.offsetLeft - parent.offsetLeft + this.clientWidth - parentBorderLeftWidth
      > parent.scrollLeft + parent.clientWidth;
    const alignWithTop = overTop && !overBottom;

    if ((overTop || overBottom) && centerIfNeeded) {
      parent.scrollTop = this.offsetTop
        - parent.offsetTop
        - parent.clientHeight / 2
        - parentBorderTopWidth
        + this.clientHeight / 2;
    }

    if ((overLeft || overRight) && centerIfNeeded) {
      parent.scrollLeft = this.offsetLeft
        - parent.offsetLeft
        - parent.clientWidth / 2
        - parentBorderLeftWidth
        + this.clientWidth / 2;
    }

    if ((overTop || overBottom || overLeft || overRight) && !centerIfNeeded) {
      this.scrollIntoView(alignWithTop);
    }
  };
}

function ChatMessages({ messages, user }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoViewIfNeeded({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <div
      id="messages"
      className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      {messages.length ? (
        messages.map((message, index) => (
          <ChatMessage key={index} user={user} message={message} index={index} />
        ))
      ) : (
        <div className="flex flex-col h-screen justify-center justify-items-center items-center font-bold text-gray-700 text-2xl text-center">
          <RiEmotionUnhappyFill size={72} />
          <span>No messages there yet</span>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatMessages;

/**
 *
 * @param { {
 *  message: {
 *    text: String,
 *    authorLogin: String,
 *    authorImage: String
 *  },
 *  user: {} } } param0
 * @returns
 */
function ChatMessage({ message, user }) {
  const fromMe = message.author.login === user.login;
  const sendTime = new Date(message.sendTime).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  });
  const { text } = message;

  return (
    <>
      {fromMe ? (
        <div className="chat-message">
          <div className="flex items-end justify-end">
            <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
              <div>
                <span className="px-4 py-2 break-all whitespace-pre-wrap w-full rounded-lg inline-block rounded-br-none bg-blue-700 text-white ">
                  {text}
                </span>
                <div className="flex justify-between">
                  <span></span>
                  <span className=" text-gray-600 text-2xs">{sendTime}</span>
                </div>
              </div>
            </div>
            <img
              src={message.author.profilePicture}
              alt="My profile"
              className="w-6 h-6 rounded-full order-2"
            ></img>
          </div>
        </div>
      ) : (
        <div className="chat-message">
          <div className="flex items-end">
            <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
              <div>
                <span className="px-4 py-2 break-all whitespace-pre-wrap w-full rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-900">
                  {text}
                </span>
                <div className="flex justify-between">
                  <span className=" text-gray-600 text-2xs">{sendTime}</span>
                  <span></span>
                </div>
              </div>
            </div>
            <img
              src={message.author.profilePicture}
              alt="My profile"
              className="w-6 h-6 rounded-full order-1"
            ></img>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatMessage;

import { FaClipboard, FaClipboardCheck } from 'react-icons/fa';
import { Card, TextInput } from 'flowbite-react';
import { useState } from 'react';
import config from '../config';

function InvitationLink({ token, type }) {
  const [clicked, setClicked] = useState(false);
  let link;
  if (type === 'calendar') {
    link = `${config.CLIENT_URL}calendars/join/${token}`;
  } else if (type === 'event') {
    link = `${config.CLIENT_URL}events/join/${token}`;
  }
  const onClick = () => {
    setClicked(true);
    navigator.clipboard.writeText(link);
    setTimeout(() => {
      setClicked(false);
    }, 2000);
  };
  return (
    <Card>
      <span className="text-gray-500 text-2xl text-center">Invitation Link</span>
      <TextInput
        onClick={onClick}
        value={link}
        color={clicked ? 'success' : 'gray'}
        readOnly={true}
        addon={
          clicked ? (
            <FaClipboardCheck onClick={onClick} className=" text-xl text-green-500" />
          ) : (
            <FaClipboard onClick={onClick} className="text-xl text-white" />
          )
        }
        shadow={true}
      />
    </Card>
  );
}

export default InvitationLink;

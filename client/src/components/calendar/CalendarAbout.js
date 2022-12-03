/* eslint-disable import/named */
/* eslint-disable camelcase */
import { TextInput, Card } from 'flowbite-react';
import moment from 'moment';
import { BsFillPersonCheckFill, BsFillPersonPlusFill } from 'react-icons/bs';
import { FaClipboard, FaClipboardCheck } from 'react-icons/fa';
import { useState } from 'react';
import { useGetCalendarMutation } from '../../features/calendars/calendarsApi.slice';
import CardLoader from '../CardLoader';
import config from '../../config';
import Users from './Users';

function CalendarAbout({ calendar }) {
  const [clicked, setClicked] = useState(false);

  const onClick = () => {
    const link = `${`${config.CLIENT_URL}calendars/join/${calendar.inviteLink}`}`;
    setClicked(true);
    navigator.clipboard.writeText(link);
    setTimeout(() => {
      setClicked(false);
    }, 2000);
  };

  const [, calendarState] = useGetCalendarMutation();
  return (
    <>
      {calendarState.isLoading || !calendar ? (
        <CardLoader />
      ) : (
        <div className="flex flex-col space-y-5">
          <div className="flex flex-row items-center justify-between justify-items-center text-center">
            <span className="text-white text-3xl mb-2 underline text-center">{calendar.name}</span>
            <Users className="w-1/2" title="Creator" users={[calendar.creator]} />
          </div>
          <div className="flex justify-between items-center justify-items-center p-2 border-y-2 border-gray-500">
            <div className="flex flex-row space-x-10 text-gray-500 justify-items-center justify-center font-bold text-xl">
              <div className="flex flex-row space-x-2">
                <span>{calendar.users.length}</span>
                <BsFillPersonCheckFill size={30} />
              </div>
              <div className="flex flex-row space-x-2">
                <span>{calendar.invitedUsers.length}</span>
                <BsFillPersonPlusFill size={30} />
              </div>
            </div>
            <span className="text-gray-500">
              {`Created ${moment(calendar.createdAt).fromNow()}`}
            </span>
          </div>
          <Card>
            <span className='text-gray-500 text-center whitespace-pre-line text-2xl'>Description</span>
            <p className="text-white">{calendar.description}</p>
          </Card>
          <Card>
            <span className="text-gray-500 text-2xl text-center">Invitation Link</span>
            <TextInput
              onClick={onClick}
              value={`${`${config.CLIENT_URL}calendars/join/${calendar.inviteLink}`}`}
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
        </div>
      )}
    </>
  );
}

export default CalendarAbout;

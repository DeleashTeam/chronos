/* eslint-disable no-underscore-dangle */
import { Tabs } from 'flowbite-react';
import { useSelector } from 'react-redux';
import CalendarAbout from './CalendarAbout';
import CalendarEvents from './CalendarEvents';
import CalendarSettings from './CalendarSettings';
import CalendarUsers from './CalendarUsers';
import Chat from '../event/chat/Chat';

function SideBar() {
  const { calendar, upcomingEvents } = useSelector((state) => state.calendars);
  return (
    <Tabs.Group className="w-full overflow-x-hidden mx-2 pr-5 justify-center" style="underline">
      <Tabs.Item title="Upcoming">
        <CalendarEvents events={upcomingEvents} />
      </Tabs.Item>
      <Tabs.Item title="About">
        <CalendarAbout calendar={calendar} />
      </Tabs.Item>
      <Tabs.Item title="Users">
        <CalendarUsers calendar={calendar} />
      </Tabs.Item>
      <Tabs.Item title="Settings">
        <CalendarSettings calendar={calendar} />
      </Tabs.Item>
      <Tabs.Item title="Chat">
        <div className="flex gap-4 w-full flex-col h-screen m-1 p-2 rounded-xl bg-gray-900 justify-items-center">
          <Chat messages={calendar ? calendar.messages : []} calendarId={calendar?._id} />
        </div>
      </Tabs.Item>
    </Tabs.Group>
  );
}

export default SideBar;

/* eslint-disable no-underscore-dangle */
import { Tabs } from 'flowbite-react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import MyCalendar from '../components/calendar/Calendar';
import {
  useGetCalendarsMutation,
  useGetCalendarMutation,
  useGetEventsMutation,
} from '../features/calendars/calendarsApi.slice';
import CardLoader from '../components/CardLoader';
import { selectCalendars } from '../features/calendars/calendars.slice';
import CreateCalendar from '../components/calendar/CreateCalendar';
import SideBar from '../components/calendar/SideBar';

const CalendarsPage = () => {
  const [getCalendar, getCalendarState] = useGetCalendarMutation();
  const params = {
    from: new Date().toISOString(),
    to: new Date(new Date().setHours(new Date().getHours() + 24)).toISOString(),
  };
  const [getCalendars, { isLoading, isUninitialized }] = useGetCalendarsMutation();
  const [getEvents] = useGetEventsMutation();
  const calendars = useSelector(selectCalendars);
  useEffect(() => {
    getCalendars();
  }, []);

  useEffect(() => {
    if (calendars[0]) {
      getCalendar(calendars[0]._id);
      getEvents({
        id: calendars[0]._id,
        params,
      });
    }
  }, [calendars]);

  return (
    <div className="flex justify-between flex-col-reverse lg:flex-row bg-gray-900">
      <div className="flex w-full lg:w-1/3 justify-center mt-4 items-start lg:border-r-2">
        {isLoading && !isUninitialized ? <CardLoader /> : <SideBar />}
      </div>
      <div className="flex w-full lg:rounded-l-xl lg:w-2/3 h-full bg-gray-900 justify-center items-center">
        {isLoading ? (
          <CardLoader />
        ) : (
          <Tabs.Group
            aria-level="Calendars"
            className="lg:w-full w-full mx-2 mt-2 justify-center"
            style="underline"
          >
            {calendars.map((cld) => (
              <Tabs.Item
                key={cld._id}
                title={
                  <span
                    className="rounded-lg px-5 py-3 -m-4"
                    onClick={() => {
                      getCalendar(cld._id);
                      getEvents({
                        id: cld._id,
                        params,
                      });
                    }}
                  >
                    {cld.name}
                  </span>
                }
              >
                {getCalendarState.isLoading ? <CardLoader /> : <MyCalendar calendar={cld} />}
              </Tabs.Item>
            ))}
            <Tabs.Item title="Create...">
              <CreateCalendar />
            </Tabs.Item>
          </Tabs.Group>
        )}
      </div>
    </div>
  );
};
export default CalendarsPage;

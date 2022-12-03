/* eslint-disable no-underscore-dangle */
import { Card } from 'flowbite-react';
import { useGetEventsMutation } from '../../features/calendars/calendarsApi.slice';
import CardLoader from '../CardLoader';
import EventCard from './EventCard';

function CalendarEvents({ events, className, eventClassName }) {
  const [, { isLoading }] = useGetEventsMutation();
  return (
    <div className="flex flex-col justify-center justify-items-center w-full">
      {isLoading ? (
        <CardLoader />
      ) : (
        <Card className={`w-full ${className}`}>
          <h5 className="font-bold text-white text-xl text-center border-b-2 border-b-gray-500">
            Upcoming Events
          </h5>
          <div className="flex flex-wrap justify-evenly gap-1">
            {events.map((event, index) => (
              <EventCard key={index} event={event.event} className={eventClassName} />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

export default CalendarEvents;

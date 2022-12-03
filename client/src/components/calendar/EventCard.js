/* eslint-disable no-underscore-dangle */
import moment from 'moment';
import { BsCalendar } from 'react-icons/bs';

function EventCard({ event, className }) {
  return (
    <div
      className={`flex-wrap justify-between gap-2 border-2 border-slate-900 shadow-inner w-full p-2 bg-gray-900 rounded-xl flex flex-row justify-items-center items-center ${className}`}
    >
      <div
        className="rounded-xl w-14 h-14 shadow-inner"
        style={{ backgroundColor: event.color }}
      ></div>
      <div className="flex flex-col w-4/5">
        <div className="flex flex-row justify-between">
          <span className="text-lg text-white">{event.name}</span>
          <span className="text-md text-gray-600">{event.type}</span>
        </div>
        <div className="flex justify-start flex-row items-center gap-2 text-gray-500">
          <BsCalendar />
          <span>{moment(event.startAt).format('MMMM Do YYYY, h:mm a')}</span>
        </div>
      </div>
    </div>
  );
}

export default EventCard;

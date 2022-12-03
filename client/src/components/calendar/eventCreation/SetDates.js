import { Label } from 'flowbite-react';
import DatePicker from 'react-datepicker';
import { BsFillCalendar2PlusFill } from 'react-icons/bs';
import moment from 'moment';
import { useState } from 'react';

function Dates({ formState, onFormChange }) {
  const [editStart, setEditStart] = useState(false);
  const [editEnd, setEditEnd] = useState(false);
  return (
    <div className="flex gap-2 flex-col">
      <Label>Event Dates</Label>
      <div className="flex flex-row justify-between items-center">
        <span className="text-gray-500 text-md">Starts at</span>
        <span className="text-white text-xs flex flex-row gap-4 items-center">
          {editStart ? (
            <DatePicker
              value={moment(formState.startAt).format('DD.MM.YY hh.mm')}
              className="rounded-xl text-xs bg-gray-700"
              onChange={(date) => {
                onFormChange('startAt', date);
              }}
              showTimeSelect
            />
          ) : (
            moment(formState.startAt).format('MMMM Do YYYY, h:mm a')
          )}
          <BsFillCalendar2PlusFill
            onClick={() => setEditStart(!editStart)}
            className="text-blue-600 cursor-pointer"
            size={20}
          />
        </span>
      </div>
      <div className="flex flex-row justify-between items-center">
        <span className="text-gray-500 text-md">Ends at</span>
        <span className="text-white text-xs flex flex-row gap-4 items-center">
          {editEnd ? (
            <DatePicker
              selected={formState.end || formState.startAt}
              value={moment(formState.end).format('DD.MM.YY hh.mm')}
              className="rounded-xl text-xs bg-gray-700"
              onChange={(date) => {
                onFormChange('end', date);
              }}
              showTimeSelect
            />
          ) : (
            moment(formState.end).format('MMMM Do YYYY, h:mm a')
          )}
          <BsFillCalendar2PlusFill
            onClick={() => setEditEnd(!editEnd)}
            className="text-blue-600 cursor-pointer"
            size={20}
          />
        </span>
      </div>
    </div>
  );
}

export default Dates;

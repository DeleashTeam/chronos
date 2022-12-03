import { Dropdown, Label } from 'flowbite-react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

function Frequency({ formState, onFormChange, frequencies }) {
  return (
    <div className="flex flex-row gap-2 justify-between items-center">
      <div className="w-full flex flex-row items-center justify-between gap-2">
        <Label>Frequency</Label>
        <Dropdown className="w-24" label={`Every ${formState.frequency || ''}`}>
          {frequencies.map((freq) => (
            <Dropdown.Item onClick={() => onFormChange('frequency', freq)} key={freq}>
              {freq}
            </Dropdown.Item>
          ))}
        </Dropdown>
      </div>
      <div className="flex flex-row w-full gap-2 items-center">
        <Label>Until</Label>
        <DatePicker
          value={moment(formState.endAt || formState.end).format('DD.MM.YY hh.mm')}
          className="rounded-xl text-white w-full text-xs bg-gray-700"
          onChange={(date) => {
            onFormChange('endAt', date);
          }}
          showTimeSelect
        />
      </div>
    </div>
  );
}

export default Frequency;

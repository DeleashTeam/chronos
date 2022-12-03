import {
  Modal, TextInput, Card, Label, Button,
} from 'flowbite-react';
import { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { RRule } from 'rrule';
import Dates from './eventCreation/SetDates';
import Frequency from './eventCreation/SetFrequency';
import TypeAndColor from './eventCreation/SetTypeColor';
import {
  useCreateEventMutation,
  useGetCalendarMutation,
} from '../../features/calendars/calendarsApi.slice';
import Executor from './eventCreation/ChooseExecutor';

const colors = ['#33B679', '#D50000', '#E67C73', '#F4511E', '#F6BF26'];
const types = ['arrangement', 'task', 'holiday', 'reminder'];
const frequencies = ['day', 'week', 'month', 'year'];

const rruleFreq = {
  day: RRule.DAILY,
  week: RRule.WEEKLY,
  month: RRule.MONTHLY,
  year: RRule.YEARLY,
};

function EventCreationModal({
  dates, show, setShow, id,
}) {
  const [createEvent, { isLoading, isSuccess }] = useCreateEventMutation();
  const [getCalendar] = useGetCalendarMutation();
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    color: colors[0],
    duration: 0,
    type: types[0],
    startAt: dates?.start,
    end: dates?.end,
  });

  const onFormChange = (key, value) => {
    setFormState({ ...formState, [key]: value });
  };

  useEffect(() => {
    if (dates && dates.start && dates.end) {
      setFormState({ ...formState, startAt: dates.start, end: dates.end });
    }
  }, [dates]);
  const onCreateEvent = () => {
    const { end, frequency, ...eventData } = formState;
    let rrule = null;
    if (frequency && formState.endAt) {
      rrule = new RRule({
        freq: rruleFreq[frequency],
        dtstart: formState.startAt,
        until: formState.endAt,
      }).toString();
    }
    createEvent({
      id,
      event: {
        ...eventData,
        ...(rrule ? { rrule } : {}),
        duration:
          (new Date(formState.end).getTime() - new Date(formState.startAt).getTime()) / 1000,
      },
    });
    setShow(false);
    setFormState({
      description: '',
      name: '',
      color: colors[0],
      duration: 0,
      type: types[0],
      startAt: dates?.start,
      end: dates?.end,
    });
  };

  useEffect(() => {
    if (!isLoading && isSuccess) getCalendar(id);
  }, [isLoading]);

  return (
    <Modal
      size="lg"
      show={show}
      onClose={() => {
        setShow(!show);
      }}
    >
      <Modal.Header className="bg-gray-900">Create Event</Modal.Header>
      <Modal.Body className="bg-gray-900">
        <Card className="flex flex-col w-full justify-center justify-items-center gap-2">
          <TypeAndColor
            types={types}
            colors={colors}
            formState={formState}
            onFormChange={onFormChange}
          />
          <div>
            <Label>Event Name</Label>
            <TextInput
              onChange={(e) => onFormChange('name', e.target.value)}
              value={formState.name}
            />
            <Label>Description</Label>
            <TextInput
              placeholder="event description ..."
              value={formState.description}
              onChange={(e) => onFormChange('description', e.target.value)}
            />
          </div>
          <Dates formState={formState} onFormChange={onFormChange} />
          {formState.type !== 'task' && (
            <>
              <Frequency
                frequencies={frequencies}
                formState={formState}
                onFormChange={onFormChange}
              />
            </>
          )}

          {formState.type === 'task' && (
            <div>
              <Label>Executor</Label>
              <Executor onFormChange={onFormChange} formState={formState} />
            </div>
          )}

          <Button onClick={onCreateEvent}>Create Event</Button>
        </Card>
      </Modal.Body>
    </Modal>
  );
}

export default EventCreationModal;

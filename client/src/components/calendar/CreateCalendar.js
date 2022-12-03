import { Button, Label, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateCalendarMutation } from '../../features/calendars/calendarsApi.slice';
import CardLoader from '../CardLoader';

function CreateCalendar() {
  const navigate = useNavigate();
  const [createCalendar, createCalendarState] = useCreateCalendarMutation();
  const [error, setError] = useState('');
  const [formState, setFormState] = useState({ name: '', description: '' });
  const onCreate = async () => {
    if (formState.name.length < 3) setError('Name should be at least 3 characters long');
    else {
      await createCalendar(formState);
      navigate(0);
    }
  };

  const onChange = (event) => {
    setFormState({ ...formState, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    setError('');
  }, [formState]);
  return (
    <>
      {createCalendarState.isLoading ? (
        <CardLoader />
      ) : (
        <div className="flex flex-col items-center justify-center">
          <h1 className="mb-5 text-white font-bold text-2xl">Create a Calendar</h1>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value="Name" />
            </div>
            <TextInput
              name="name"
              onChange={onChange}
              value={formState.name}
              type="text"
              sizing="md"
              helperText={<span className="text-xs text-red-600">{error}</span>}
            />
            <div className="mb-2 block">
              <Label htmlFor="name" value="Description" />
            </div>
            <TextInput
              name="description"
              onChange={onChange}
              value={formState.description}
              type="text"
              sizing="md"
              helperText={<span className="text-xs text-red-600">{error}</span>}
            />
          </div>
          <Button onClick={onCreate}>Create</Button>
        </div>
      )}
    </>
  );
}

export default CreateCalendar;

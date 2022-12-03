/* eslint-disable no-underscore-dangle */
import { HiBadgeCheck, HiPencilAlt } from 'react-icons/hi';
import {
  Card, Label, TextInput, Radio, Button, Spinner,
} from 'flowbite-react';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetCalendarMutation,
  useDeleteCalendarMutation,
  useRemoveUserMutation,
  useUpdateCalendarMutation,
} from '../../features/calendars/calendarsApi.slice';
import CardLoader from '../CardLoader';
import ConfirmationModal from './ConfirmationModal';

function CalendarSettings({ calendar }) {
  const navigate = useNavigate();
  const [getCalendar, { isLoading }] = useGetCalendarMutation();
  const [deleteCalendar] = useDeleteCalendarMutation();
  const [removeUser] = useRemoveUserMutation();
  const [updateCalendar, updateCalendarState] = useUpdateCalendarMutation();
  const [success, setSuccess] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [settingsForm, setSettingsForm] = useState({
    name: '',
    description: '',
    joinType: '',
  });

  const onChange = (event) => {
    setSettingsForm({ ...settingsForm, [event.target.name]: event.target.value });
  };

  const onSave = () => {
    updateCalendar({ body: settingsForm, id: calendar._id });
    if (!updateCalendarState.isError && !updateCalendarState.isLoading) {
      getCalendar(calendar._id);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 1000);
    }
  };

  useEffect(() => {
    setSettingsForm({
      name: calendar?.name,
      description: calendar?.description,
      joinType: calendar?.joinType,
    });
  }, [calendar]);

  return (
    <>
      {isLoading || !calendar ? (
        <CardLoader />
      ) : (
        <div className="flex flex-col justify-center">
          <div className="bg-gray-900 p-5">
            <div className="flex flex-wrap justify-between items-center">
              <span className="text-3xl font-bold text-gray-500">Change Name / Join Type</span>
            </div>
            <div className="border-2 rounded-xl my-4 text-gray-400 border-indigo-800">
              <div className="m-5 text-lg">
                <HiPencilAlt size="50" />
                <span className="text-2xl"> Choosing a good name </span>
                <p>While changing the name, take into account that every user will see this name</p>
                <span>Join Types</span>
                <ul className="list-disc marker:text-indigo-800 mx-10">
                  <li>Everyone - any user can join with invite link.</li>
                  <li>Invited Only - only invited users can join via link.</li>
                </ul>
              </div>
            </div>
          </div>
          {updateCalendarState.isLoading ? (
            <div className="flex w-full justify-center justify-items-center">
              <Spinner size="xl" />
            </div>
          ) : (
            <Card>
              {success ? (
                <div className="flex w-full justify-center justify-items-center text-white">
                  <HiBadgeCheck size={70} />
                </div>
              ) : (
                <>
                  <Label>Name</Label>
                  <TextInput
                    name="name"
                    placeholder="calendar name (e.g. 'My Calendar')"
                    disabled={user.login !== calendar.creator.login}
                    onChange={onChange}
                    value={settingsForm.name || ''}
                  />
                  <Label>Description</Label>
                  <TextInput
                    name="description"
                    placeholder="calendar description (e.g. 'Calendar Description')"
                    disabled={user.login !== calendar.creator.login}
                    onChange={onChange}
                    value={settingsForm.description || ''}
                  />
                  <Label>JoinType</Label>
                  <fieldset className="flex flex-col gap-4" id="radio">
                    <div className="flex items-center gap-2">
                      <Radio
                        name="joinType"
                        value="everyone"
                        disabled={user.login !== calendar.creator.login}
                        defaultChecked={calendar.joinType === 'everyone'}
                        onClick={onChange}
                      />
                      <Label htmlFor="united-state">Everyone</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Radio
                        name="joinType"
                        value="invited only"
                        onClick={onChange}
                        disabled={user.login !== calendar.creator.login}
                        defaultChecked={calendar.joinType === 'invited only'}
                      />
                      <Label htmlFor="germany">Invited Only</Label>
                    </div>
                  </fieldset>
                  {user.login !== calendar.creator.login ? (
                    <span className="text-white">
                      Only admins and creators can change information about calendar.
                    </span>
                  ) : (
                    <Button onClick={onSave}> Save Changes </Button>
                  )}

                  {user.login === calendar.creator.login ? (
                    <ConfirmationModal
                      action={() => {
                        deleteCalendar(calendar._id);
                        setTimeout(() => {
                          navigate(0);
                        }, 500);
                      }}
                      title="Delete Calendar"
                    />
                  ) : (
                    <ConfirmationModal
                      action={() => {
                        removeUser({ id: calendar._id, login: user.login });
                        setTimeout(() => {
                          navigate(0);
                        }, 500);
                      }}
                      title="Leave Calendar"
                    />
                  )}
                </>
              )}
            </Card>
          )}
        </div>
      )}
    </>
  );
}

export default CalendarSettings;

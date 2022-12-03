/* eslint-disable no-underscore-dangle */
import { Avatar, Dropdown } from 'flowbite-react';
import { DropdownItem } from 'flowbite-react/lib/esm/components/Dropdown/DropdownItem';
import { useEffect, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import {
  useToggleAdminMutation,
  useGetCalendarMutation,
  useRemoveUserMutation,
} from '../../features/calendars/calendarsApi.slice';
import { eventApiSlice } from '../../features/event/eventApi.slice';

function UserCard({
  user, className, adder = null, settings = false, group = 'users', type,
}) {
  const {
    calendars: { calendar },
    event: { event },
    auth: { user: authed },
  } = useSelector((state) => state);
  const [toggleCalendarAdmin, { isLoading, isSuccess }] = useToggleAdminMutation();
  const [
    removeCalendarUser,
    { isLoading: isRemoveLoading, isSuccess: isRemoveSuccess },
  ] = useRemoveUserMutation();
  const [getCalendar] = useGetCalendarMutation();
  const [toggleEventAdmin, toggleEventAdminState] = eventApiSlice.useToggleEventAdminMutation();
  const [removeEventUser, removeEventUserState] = eventApiSlice.useRemoveEventUserMutation();
  const [getEvent] = eventApiSlice.useGetEventMutation();
  const [roles, setRoles] = useState({ authed: 'user', user: 'user' });

  const getRole = ({ login }) => {
    if (type === 'calendar') {
      if (calendar?.creator.login === login) return 'creator';
      if (calendar?.admins.find((admin) => admin.login === login)) return 'admin';
    }
    if (type === 'event') {
      if (event?.creator.login === login) return 'creator';
      if (event?.admins.find((admin) => admin.login === login)) return 'admin';
    }
    return 'user';
  };

  useEffect(() => {
    setRoles({ authed: getRole(authed), user: getRole(user) });
  }, []);

  useEffect(
    () => {
      if (type === 'calendar') {
        if ((!isLoading && isSuccess) || (!isRemoveLoading && isRemoveSuccess)) {
          getCalendar(calendar._id);
        }
      }

      if (type === 'event') {
        if (
          (!toggleEventAdminState.isLoading && toggleEventAdminState.isSuccess)
          || (!removeEventUserState.isLoading && removeEventUserState.isSuccess)
        ) {
          getEvent(event._id);
        }
      }
    },
    type === 'calendar'
      ? [isLoading, isRemoveLoading]
      : [toggleEventAdminState.isLoading, removeEventUserState.isLoading],
  );

  const onToggleAdmin = () => {
    if (type === 'calendar') toggleCalendarAdmin({ id: calendar._id, login: user.login });
    if (type === 'event') toggleEventAdmin({ id: event._id, login: user.login });
  };

  const onRemoveUser = () => {
    if (type === 'calendar') removeCalendarUser({ id: calendar._id, login: user.login });
    if (type === 'event') removeEventUser({ id: event._id, login: user.login });
  };

  return (
    <div
      className={`flex-wrap justify-between border-2 border-slate-900 shadow-inner w-full p-2 bg-gray-900 rounded-xl flex flex-row justify-items-center items-center ${className}`}
    >
      <Avatar bordered={true} img={user.profilePicture} />
      <div className="flex flex-row justify-center justify-items-center items-center gap-4">
        <div className="flex flex-col ">
          <span className="text-basic text-white">{user.name}</span>
          <span className="text-gray-500 text-xs">{user.login}</span>
        </div>
        {adder}
        {!settings
        || roles.authed === 'user'
        || authed.login === user.login
        || (roles.user !== 'user' && roles.authed !== 'creator')
        || (roles.authed === 'admin' && roles.authed !== 'creator' && group === 'Admins') ? null : (
          <Dropdown
            label={<BsThreeDotsVertical className="text-white" />}
            arrowIcon={false}
            inline={true}
          >
            <DropdownItem onClick={onToggleAdmin}>
              <span className="text-green-500">
                {roles.user !== 'admin' ? 'Toggle Admin' : 'Remove from Admins'}
              </span>
            </DropdownItem>

            <DropdownItem onClick={onRemoveUser}>
              <span className="text-red-500">Remove User</span>
            </DropdownItem>
          </Dropdown>
          )}
      </div>
    </div>
  );
}

export default UserCard;

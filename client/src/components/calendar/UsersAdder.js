/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import {
  Modal, Button, Spinner, TextInput,
} from 'flowbite-react';
import {
  BsCheckLg, BsPersonCheckFill, BsPlusLg, BsPlusSquare, BsSearch,
} from 'react-icons/bs';
import { useSelector } from 'react-redux';
import UserCard from './UserCard';
import { useGetUsersMutation } from '../../features/user/userApi.slice';
import { calendarsApiSlice } from '../../features/calendars/calendarsApi.slice';
import { eventApiSlice } from '../../features/event/eventApi.slice';

function UsersAdder({ className, type }) {
  const [show, setShow] = useState(false);
  const {
    auth: { user: authed },
    user: { users },
    calendars: { calendar },
    event: { event },
  } = useSelector((state) => state);
  const [getUsers, { isLoading }] = useGetUsersMutation();
  const [getCalendar, getCalendarState] = calendarsApiSlice.useGetCalendarMutation();
  const [inviteEventUser, inviteEventUserState] = eventApiSlice.useInviteEventUserMutation();
  const [inviteUser, inviteUserState] = calendarsApiSlice.useInviteUserMutation();
  const [getEvent, getEventState] = eventApiSlice.useGetEventMutation();
  const [search, setSearch] = useState('');
  const [userLoading, setUserLoading] = useState();
  const onClose = () => {
    setShow(false);
  };

  const onEnter = (data) => {
    if (data.key === 'Enter' || data.type === 'click') getUsers({ search });
  };

  const onChange = (data) => {
    setSearch(data.target.value);
  };

  const onAdd = (user) => {
    if (type === 'calendar') {
      inviteUser({ id: calendar._id, login: user.login });
    }
    if (type === 'event') {
      inviteEventUser({ id: event._id, login: user.login });
    }
    setUserLoading(user._id);
  };

  useEffect(() => {
    if (type === 'event' && !calendar?.users) {
      getCalendar(event.calendar);
    }
  }, []);

  useEffect(
    () => {
      if (type === 'calendar') {
        if (
          !inviteUserState.isError
          && !inviteUserState.isLoading
          && !inviteUserState.isUninitialized
        ) {
          getCalendar(calendar._id);
          if (!getCalendarState.isLoading) setUserLoading();
        }
      }
      if (type === 'event') {
        if (
          !inviteEventUserState.isError
          && !inviteEventUserState.isLoading
          && !inviteEventUserState.isUninitialized
        ) {
          getEvent(event._id);
          if (!getEventState.isLoading) setUserLoading();
        }
      }
    },
    type === 'calendar' ? [inviteUserState] : [inviteEventUserState],
  );

  const getAdder = (toAdd) => {
    if (toAdd._id === userLoading) {
      return (
        <div className="text-white rounded-lg p-2">
          <Spinner />
        </div>
      );
    }
    if (type === 'calendar') {
      if (calendar.users.find((user) => user._id === toAdd._id)) {
        return (
          <div className="text-white rounded-lg bg-green-500 p-2">
            <BsCheckLg />
          </div>
        );
      }
      if (calendar.invitedUsers.find((user) => user._id === toAdd._id)) {
        return (
          <div className="text-white rounded-lg bg-orange-400 p-2">
            <BsPersonCheckFill />
          </div>
        );
      }
    }
    if (type === 'event') {
      if (event?.users.find((user) => user._id === toAdd._id)) {
        return (
          <div className="text-white rounded-lg bg-green-500 p-2">
            <BsCheckLg />
          </div>
        );
      }
    }
    return (
      <div
        onClick={() => {
          onAdd(toAdd);
        }}
        className="text-white rounded-lg hover:bg-green-500 p-2"
      >
        <BsPlusLg />
      </div>
    );
  };

  return (
    <React.Fragment>
      {(type === 'calendar'
        && (calendar.admins.find((admin) => admin.login === authed.login)
          || calendar.creator === authed.login))
      || (type === 'event'
        && (event.admins.find((admin) => admin.login === authed.login)
          || event.creator === authed.login)) ? (
        <Button
          className={`${className}`}
          onClick={() => {
            setShow(true);
          }}
        >
          <BsPlusSquare size={30} />
        </Button>
        ) : null}

      <Modal show={show} size="md" popup={true} onClose={onClose}>
        <Modal.Header className="bg-gray-900">Invite Users</Modal.Header>
        <Modal.Body className="bg-gray-900">
          <div className="flex w-full justify-center gap-4 items-center justify-items-center flex-col p-5">
            {type === 'event' ? null : (
              <TextInput
                onKeyDown={onEnter}
                addon={<BsSearch name="search" onClick={onEnter} />}
                className="w-80"
                value={search}
                onChange={onChange}
              />
            )}
            {isLoading ? (
              <Spinner size="xl" />
            ) : (
              <>
                {users.length || type === 'event' ? (
                  <div className="w-full h-72 overflow-auto">
                    {type === 'event'
                      ? calendar?.users.map((user, index) => (
                          <UserCard adder={getAdder(user)} key={index} user={user} />
                      ))
                      : users.map((user, index) => (
                          <UserCard adder={getAdder(user)} key={index} user={user} />
                      ))}
                  </div>
                ) : (
                  <span className="text-gray-700 font-bold text-lg">Start Search To See Users</span>
                )}
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

export default UsersAdder;

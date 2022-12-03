import React, { useState } from 'react';
import { Button, Modal, Avatar } from 'flowbite-react';
import { BsPlusSquare } from 'react-icons/bs';
import { useSelector } from 'react-redux';

function Executor({ formState, onFormChange }) {
  const [show, setShow] = useState(false);
  const [executor, setExecutor] = useState(null);
  // eslint-disable-next-line max-len
  const users = useSelector((state) => state.calendars.calendar.users.filter((user) => user.login !== state.auth.user.login));
  const onAdd = (user) => {
    setExecutor(user);
    onFormChange('executorLogin', user.login);
    setShow(false);
  };

  return (
    <React.Fragment>
      {formState.executorLogin && executor ? (
        <div
          onClick={() => {
            setShow(true);
          }}
          className="flex-wrap cursor-pointer justify-between border-2 border-slate-900 shadow-inner w-full p-2 bg-gray-900 rounded-xl flex flex-row justify-items-center items-center"
        >
          <Avatar bordered={true} img={executor.profilePicture} />
          <div className="flex flex-row justify-center justify-items-center items-center gap-4">
            <div className="flex flex-col ">
              <span className="text-basic text-white">{executor.name}</span>
              <span className="text-gray-500 text-xs">{executor.login}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className='flex w-full justify-center'>
        <Button
          className="w-full"
          size='xs'
          onClick={() => {
            setShow(true);
          }}
        >
          <BsPlusSquare size={28} />
        </Button>
        </div>
      )}

      <Modal show={show} size="md" popup={true} onClose={() => setShow(!show)}>
        <Modal.Header className="bg-gray-900">Invite Users</Modal.Header>
        <Modal.Body className="bg-gray-900">
          <div className="flex w-full justify-center gap-4 items-center justify-items-center flex-col p-5">
            <div className="w-full h-72 overflow-auto">
              {users.map((user, index) => (
                <div
                  key={index}
                  onClick={() => onAdd(user)}
                  className="flex-wrap justify-between cursor-pointer border-2 border-slate-900 shadow-inner w-full p-2 bg-gray-900 rounded-xl flex flex-row justify-items-center items-center"
                >
                  <Avatar bordered={true} img={user.profilePicture} />
                  <div className="flex flex-row  justify-center justify-items-center items-center gap-4">
                    <div className="flex flex-col ">
                      <span className="text-basic text-white">{user.name}</span>
                      <span className="text-gray-500 text-xs">{user.login}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

export default Executor;

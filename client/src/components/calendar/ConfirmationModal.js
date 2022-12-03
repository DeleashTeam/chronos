import React, { useState } from 'react';
import { Modal, Button } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

function ConfirmationModal({ action, title = 'do this' }) {
  const [show, setShow] = useState(false);
  const onClose = () => {
    setShow(false);
  };
  return (
    <React.Fragment>
      <Button
        color="failure"
        onClick={() => {
          setShow(true);
        }}
      >
        {title}
      </Button>
      <Modal show={show} size="md" popup={true} onClose={onClose}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {`Are you sure you want to ${title}?`}
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  action();
                  onClose();
                }}
              >
                Yes, I am sure
              </Button>
              <Button color="gray" onClick={onClose}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

export default ConfirmationModal;

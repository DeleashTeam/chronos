import { Fragment, useState } from 'react';
import {
  Modal, Button, Label, TextInput, Spinner,
} from 'flowbite-react';
import { HiBadgeCheck } from 'react-icons/hi';
import { useRequestResetPasswordMutation } from '../../features/auth/authApi.slice';

const ForgotPasswordModal = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [requestResetPassword, requestResetStatus] = useRequestResetPasswordMutation();
  const sendEmail = () => {
    requestResetPassword(email);
    if (!requestResetStatus.isError) {
      setEmailSent(true);
      setTimeout(() => {
        setEmailSent(false);
        setShow(false);
      }, 2000);
    }
  };
  return (
    <Fragment>
      <a
        onClick={() => {
          setShow(!show);
        }}
        className="cursor-pointer font-medium text-orange-500 hover:text-orange-400"
      >
        Forgot your password?
      </a>
      <Modal
        show={show}
        size="md"
        popup={true}
        onClose={() => {
          setShow(!show);
        }}
      >
        <Modal.Header className="bg-gray-900" />
        <Modal.Body className="bg-gray-900">
          {requestResetStatus.isLoading ? (
            <div className="text-center">
              <Spinner size="xl" />
            </div>
          ) : (
            <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
              {emailSent ? (
                <div className="flex items-center justify-center text-5xl text-center text-white">
                  <HiBadgeCheck />
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-medium text-white">
                    {' '}
                    We would need your email address{' '}
                  </h3>
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="email" value="Your email" />
                    </div>
                    <TextInput
                      id="email"
                      placeholder="name@company.com"
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      value={email}
                      required={true}
                    />
                  </div>
                  <div className="flex justify-between w-full">
                    <span> </span>
                    <Button onClick={sendEmail}>Send email</Button>
                  </div>
                </>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </Fragment>
  );
};

export default ForgotPasswordModal;

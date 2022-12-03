import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HiMail } from 'react-icons/hi';
import { TextInput, Button } from 'flowbite-react';
import { useRequestEmailConfirmationMutation } from '../features/auth/authApi.slice';

const ConfirmEmailPage = () => {
  const [params] = useSearchParams();
  const [email, setEmail] = useState('');
  const [requestEmailConfirmation] = useRequestEmailConfirmationMutation();
  const onChange = (event) => {
    setEmail(event.target.value);
  };
  const onClick = () => {
    requestEmailConfirmation(email);
  };
  return (
    <div className="flex items-center justify-center min-h-screen p-5 min-w-screen">
      <div className="max-w-xl p-8 text-center text-gray-400 bg-gray-900 shadow-xl lg:max-w-3xl rounded-3xl lg:p-12">
        <h3 className="text-2xl">{params.get('message')}</h3>
        <div className="flex justify-center text-gray-200">
          <HiMail size="50" />
        </div>
        {params.get('status') === '200' ? null : (
          <p>Either your Email is already confirmed or the link has expired</p>
        )}

        <div className="mt-4">
          {params.get('status') === '200' ? (
            <a href="/login" className="px-2 py-2 text-blue-200 bg-blue-600 rounded">
              You can login now
            </a>
          ) : (
            <div className="flex flex-col space-y-3 p-2">
              <TextInput
                type="email"
                value={email}
                onChange={onChange}
                placeholder="Write your email here"
              />
              <Button onClick={onClick}>Send another confirmation link</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmailPage;

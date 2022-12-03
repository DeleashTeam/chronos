import { useEffect, useState } from 'react';
import { HiBadgeCheck } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { Button } from 'flowbite-react';
import { useGoogleLogin } from '@react-oauth/google';
import { loginFields } from '../../config/formFields';
import FormAction from './FormAction';
import FormExtra from './FormExtra';
import Input from './Input';
import Loading from './FormLoading';
import { useLoginMutation, useGoogleAuthMutation } from '../../features/auth/authApi.slice';

const fields = loginFields;
const fieldsState = {};
fields.forEach((field) => {
  fieldsState[field.id] = '';
  return fieldsState[field.id];
});

const Login = () => {
  const navigate = useNavigate();
  const [loginState, setLoginState] = useState(fieldsState);
  const [success, setSuccess] = useState(false);

  const [login, loginStatus] = useLoginMutation();
  const [googleAuth, googleAuthStatus] = useGoogleAuthMutation();

  const handleChange = (e) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
  };

  const authenticateUser = async () => {
    login({ ...loginState }).unwrap();
  };

  const authWithGoogle = useGoogleLogin({ onSuccess: googleAuth });

  useEffect(() => {
    if (loginStatus.isSuccess || googleAuthStatus.isSuccess) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/calendars', { replace: true });
        return setSuccess(false);
      }, 1000);
    }
  }, [loginStatus.isSuccess, googleAuthStatus.isSuccess]);

  const handleSubmit = (e) => {
    e.preventDefault();
    authenticateUser();
  };

  return (
    <div className="container">
      {loginStatus.isLoading || googleAuthStatus.isLoading ? (
        <Loading />
      ) : (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {success ? (
            <div className="flex justify-center items-center text-9xl text-center text-white">
              <HiBadgeCheck />
            </div>
          ) : (
            <div className="space-y-6">
              <Button onClick={authWithGoogle} className="w-full mt-5 bg-gray-900">
                <FcGoogle className="mx-2" /> Auth with google
              </Button>
              {fields.map((field) => (
                <Input
                  key={field.id}
                  handleChange={handleChange}
                  value={loginState[field.id]}
                  labelText={field.labelText}
                  labelFor={field.labelFor}
                  id={field.id}
                  name={field.name}
                  type={field.type}
                  isRequired={field.isRequired}
                  placeholder={field.placeholder}
                />
              ))}
              <FormExtra />
              <FormAction handleSubmit={handleSubmit} text="Login" />
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default Login;

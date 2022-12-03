/* eslint-disable arrow-body-style */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiBadgeCheck } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import { Button } from 'flowbite-react';
import { useGoogleLogin } from '@react-oauth/google';
import { registerFields } from '../../config/formFields';
import FormAction from './FormAction';
import Input from './Input';
import { useRegisterMutation, useGoogleAuthMutation } from '../../features/auth/authApi.slice';
import Loading from './FormLoading';

const fields = registerFields;
const fieldsState = {};

fields.forEach((field) => {
  fieldsState[field.id] = '';
  return fieldsState[field.id];
});

const Register = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState('');
  const [registerState, setRegisterState] = useState(fieldsState);
  const [register, registerStatus] = useRegisterMutation();
  const [googleAuth, googleAuthStatus] = useGoogleAuthMutation();
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setErrors({ ...errors, [e.target.id]: '' });
    return setRegisterState({
      ...registerState,
      [e.target.id]: e.target.value,
    });
  };

  const createAccount = () => {
    register({ ...registerState });
  };

  const authWithGoogle = useGoogleLogin({ onSuccess: googleAuth });

  useEffect(() => {
    if (registerStatus.isSuccess || googleAuthStatus.isSuccess) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login', { replace: true });
        return setSuccess(false);
      }, 1000);
    }
  }, [registerStatus.isSuccess, googleAuthStatus.isSuccess]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    for (const key in registerState) {
      const { requiredLength, hasSpaces } = registerFields.filter((field) => field.id === key)[0];
      if (registerState[key].length < requiredLength) {
        newErrors = {
          ...newErrors,
          [key]: `Length of ${key} should be at least ${requiredLength}`,
        };
      } else if (registerState[key].indexOf(' ') >= 0 && !hasSpaces) {
        newErrors = {
          ...newErrors,
          [key]: `${key} should have no spaces`,
        };
      }
      setErrors(newErrors);
    }
    if (Object.keys(newErrors).length === 0) createAccount();
  };
  return (
    <div className="container">
      {registerStatus.isLoading || googleAuthStatus.isLoading ? (
        <Loading count={5} additional={false} />
      ) : (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {success ? (
            <div className="flex justify-center items-center text-9xl text-center text-white">
              <HiBadgeCheck />
            </div>
          ) : (
            <div className="space-y-4">
              <Button onClick={authWithGoogle} className="w-full mt-5 bg-gray-900">
                <FcGoogle className="mx-2" /> Auth with google
              </Button>
              {fields.map((field) => {
                return (
                  <Input
                    key={field.id}
                    handleChange={handleChange}
                    value={registerState[field.id]}
                    error={errors[field.id]}
                    labelText={field.labelText}
                    labelFor={field.labelFor}
                    id={field.id}
                    name={field.name}
                    type={field.type}
                    isRequired={field.isRequired}
                    placeholder={field.placeholder}
                  />
                );
              })}
              <FormAction handleSubmit={handleSubmit} text="Signup" />
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default Register;

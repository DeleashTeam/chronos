import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiBadgeCheck } from 'react-icons/hi';
import { resetPasswordFields } from '../../config/formFields';
import FormAction from './FormAction';
import Input from './Input';
// import { resetPasswordToken } from '../../features/auth/actions';
import { useResetPasswordMutation } from '../../features/auth/authApi.slice';
import Loading from './FormLoading';

const fields = resetPasswordFields;
const fieldsState = {};

fields.forEach((field) => {
  fieldsState[field.id] = '';
  return fieldsState[field.id];
});

const ResetPassword = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [resetPassword, { isLoading, isError }] = useResetPasswordMutation();
  const [passwordState, setPasswordState] = useState(fieldsState);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setPasswordState({
    ...passwordState,
    [e.target.id]: e.target.value,
  });

  const handleResetPassword = () => {
    resetPassword({ passwordState, token: params.token });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isError) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login', { replace: true });
        return setSuccess(false);
      }, 3000);
    }
    handleResetPassword();
  };

  return (
    <div className="container">
      {isLoading ? (
        <Loading count={5} additional={false} />
      ) : (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {success ? (
            <div className="flex justify-center items-center text-9xl text-center text-white">
              <HiBadgeCheck />
            </div>
          ) : (
            <div>
              {fields.map((field) => (
                <Input
                  key={field.id}
                  handleChange={handleChange}
                  value={passwordState[field.id]}
                  labelText={field.labelText}
                  labelFor={field.labelFor}
                  id={field.id}
                  name={field.name}
                  type={field.type}
                  isRequired={field.isRequired}
                  placeholder={field.placeholder}
                />
              ))}
              <FormAction handleSubmit={handleSubmit} text="Confirm" />
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default ResetPassword;

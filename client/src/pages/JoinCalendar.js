import { useNavigate, useParams } from 'react-router-dom';
import { HiCalendar, HiBadgeCheck } from 'react-icons/hi';
import { Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useJoinCalendarMutation } from '../features/calendars/calendarsApi.slice';
import Loading from '../components/auth/FormLoading';

const JoinCalendarPage = () => {
  const { calendarId } = useParams();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [joinCalendar, { isLoading, isSuccess }] = useJoinCalendarMutation();

  useEffect(() => {
    setSuccess(isSuccess);
    if (isSuccess) {
      setTimeout(() => {
        navigate('/calendars', { replace: true });
        return setSuccess(false);
      }, 1000);
    }
  }, [isSuccess]);

  const onClick = () => {
    joinCalendar(calendarId);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-5 min-w-screen">
      <div className="max-w-xl p-8 text-center text-gray-400 bg-gray-900 shadow-xl lg:max-w-3xl rounded-3xl lg:p-12">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {success ? (
              <div className="flex justify-center items-center text-9xl text-center text-white">
                <HiBadgeCheck />
              </div>
            ) : (
              <div className='flex flex-col'>
                <h3 className="text-2xl">You have been invited to a Calendar</h3>
                <div className="flex justify-center text-gray-200">
                  <HiCalendar size="50" />
                </div>
                <Button className='justify-center' onClick={onClick}>Join Calendar</Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JoinCalendarPage;

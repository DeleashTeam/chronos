import Users from './Users';
import CardLoader from '../CardLoader';
import { useGetCalendarMutation } from '../../features/calendars/calendarsApi.slice';

function CalendarUsers({ calendar }) {
  const [, { isLoading }] = useGetCalendarMutation();
  return (
    <div className="flex flex-col space-y-5">
      {isLoading || !calendar ? (
        <CardLoader />
      ) : (
        <div className="space-y-4">
          <Users userClassName="w-11/12" title="Creator" users={[calendar.creator]} />
          <Users
            userClassName="w-5/12"
            className=" max-h-72 overflow-auto"
            settings={true}
            title="Admins"
            users={calendar.admins}
          />
          <Users
            userClassName="w-5/12"
            className=" max-h-72 overflow-auto"
            settings={true}
            title="Users"
            users={calendar.users}
          />
          <Users
            userClassName="w-5/12"
            settings={true}
            className=" max-h-72 overflow-auto"
            title="Invited Users"
            adder={true}
            users={calendar.invitedUsers}
          />
        </div>
      )}
    </div>
  );
}

export default CalendarUsers;

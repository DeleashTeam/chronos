/* eslint-disable no-underscore-dangle */

import { Card } from 'flowbite-react';
import UserCard from './UserCard';
import UsersAdder from './UsersAdder';

function Users({
  users,
  title,
  className,
  userClassName,
  adder = false,
  settings = false,
  type = 'calendar',
}) {
  return (
    <Card className={`w-full ${className}`}>
      <h5 className="font-bold text-white text-xl text-center border-b-2 border-b-gray-500">
        {title}
      </h5>
      <div className="flex flex-wrap justify-evenly gap-1">
        {adder ? <UsersAdder type={type} className={userClassName} /> : null}

        {users.map((user) => (
          <UserCard
            settings={settings}
            type={type}
            group={title}
            className={userClassName}
            key={user._id}
            user={user}
          />
        ))}
      </div>
    </Card>
  );
}
export default Users;

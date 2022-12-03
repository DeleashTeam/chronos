import { Button } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import config from '../config';

function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="w-full p-5 h-full text-lg">
      <div className="w-full flex flex-col items-center bg-gray-900 rounded-xl p-5">
        <img className="w-1/3" src={config.LOGO_URL} />
        <span className="text-white text-3xl font-bold">About Chronos</span>
        <p className="border-2 rounded-xl my-4 p-5 text-gray-400 border-indigo-800">
          An event calendar is a useful tool. It can be used for creating, managing, and searching
          for events. It is a way a way to be informed about upcoming events and to keep people in
          the loop about meetings, conferences, seminars, etc.
          <p className="py-5">
            Some of the benefits of such calendars include:
            <ul className="list-disc marker:text-indigo-800 mx-10">
              <li>organization and efficiency</li>
              <li>holding teams accountable </li>
              <li>saving time significantly</li>
              <li>improving your results</li>
            </ul>
          </p>
          Planning plays a pivotal role in effective time management. Time management, in turn, is
          vital not only in the organization of the working process but also in streamlining
          one&apos;s personal life. Planning lets individuals split big tasks into smaller parts,
          thus helping them to complete assignments step by step and on time. It also makes it clear
          what requires urgent attention and what can be done a little later.
          <Button
            onClick={() => {
              navigate('/calendars');
            }}
            className="w-full justify-center"
          >
            Create My First Calendar
          </Button>
        </p>
      </div>
    </div>
  );
}

export default HomePage;

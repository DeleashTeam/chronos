import { Navbar } from 'flowbite-react';

const AuthButtons = () => (
    <div className="flex items-center md:order-2">
      <a
        href="/login"
        className="text-white focus:ring-4 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 mr-1 md:mr-2 hover:bg-gray-700 focus:outline-none focus:ring-gray-800"
      >
        Login
      </a>
      <a
        href="/register"
        className="text-white focus:ring-4  font-medium rounded-lg text-xs px-4 py-2 md:px-5 md:py-2.5 mr-1 md:mr-2 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800"
      >
        Sign up
      </a>
      <Navbar.Toggle />
    </div>
);

export default AuthButtons;

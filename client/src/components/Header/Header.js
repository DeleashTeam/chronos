/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
import { useSelector } from 'react-redux';
import { HiHome } from 'react-icons/hi';
import { Navbar } from 'flowbite-react';
import config from '../../config';
import AuthButtons from './AuthButtons';
import UserMenu from './UserMenu';

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  return (
    <Navbar fluid={true}>
      <Navbar.Brand href="/">
        <img src={config.LOGO_URL} className="mr-3 h-10" alt="Logo" />
      </Navbar.Brand>
      {isAuthenticated ? <UserMenu user={user} /> : <AuthButtons />}
      <Navbar.Collapse>
        <Navbar.Link href="/" active={true}>
          <HiHome className="text-2xl" />
        </Navbar.Link>
        <Navbar.Link href="/calendars">
          <span className="text-base">Calendars</span>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;

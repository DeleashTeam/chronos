import { HiViewGrid, HiCog, HiLogout } from 'react-icons/hi';
import { Dropdown, Navbar } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { useSendLogoutMutation } from '../../features/auth/authApi.slice';
import SettingsModal from './SettingsModal';

const UserMenu = ({ user }) => {
  const navigate = useNavigate();
  const [logout] = useSendLogoutMutation();
  const signOut = () => {
    logout();
    navigate('/login');
  };
  const {
    profilePicture, email, fullName, login,
  } = user;
  return (
    <div className="flex md:order-2">
      <Dropdown
        arrowIcon={false}
        inline={true}
        label={
          <img
            className="w-10 h-10 rounded-full"
            // crossOrigin="anonymous"
            src={profilePicture}
            alt="user photo"
          />
        }
      >
        <Dropdown.Header>
          <span className="block text-sm">{fullName || login}</span>
          <span className="block text-sm font-medium truncate">{email}</span>
        </Dropdown.Header>
        <Dropdown.Item
          onClick={() => {
            navigate('/calendars');
          }}
          icon={HiViewGrid}
        >
          Calendars
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item icon={HiCog}>
          <SettingsModal user={user} />
        </Dropdown.Item>
        <Dropdown.Item onClick={signOut} icon={HiLogout}>
          Sign out
        </Dropdown.Item>
      </Dropdown>
      <Navbar.Toggle />
    </div>
  );
};

export default UserMenu;

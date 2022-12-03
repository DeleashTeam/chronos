import { Link } from 'react-router-dom';
import config from '../../config';

const Header = ({
  heading, paragraph, linkName, linkUrl = '#',
}) => (
  <div className="mb-10">
    <div className="flex justify-center">
      <img alt="" className="h-20" src={config.LOGO_URL} />
    </div>
    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">{heading}</h2>
    <p className="mt-2 text-center text-sm text-white">
      {paragraph}{' '}
      <Link to={linkUrl} className="font-medium text-orange-500 hover:text-orange-400">
        {linkName}
      </Link>
    </p>
  </div>
);
export default Header;

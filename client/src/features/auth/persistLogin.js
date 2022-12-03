import { Outlet } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRefreshMutation } from './authApi.slice';
// import usePersist from '../../hooks/usePersist';
import { selectCurrentToken } from './auth.slice';
import CardLoader from '../../components/CardLoader';

const PersistLogin = () => {
  // const [persist] = usePersist();
  const persist = true;
  const token = useSelector(selectCurrentToken);
  const effectRan = useRef(false);

  const [trueSuccess, setTrueSuccess] = useState(false);

  const [refresh, { isLoading, isSuccess }] = useRefreshMutation();

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
      const verifyRefreshToken = async () => {
        await refresh();
        setTrueSuccess(true);
      };

      if (!token && persist) {
        verifyRefreshToken();
      }
    }

    // eslint-disable-next-line no-return-assign
    return () => (effectRan.current = true);
  }, []);

  let content;
  if (!persist) {
    content = <Outlet />;
  } else if (isLoading) {
    content = CardLoader();
  } else if (isSuccess && trueSuccess) {
    content = <Outlet />;
  } else if (trueSuccess) {
    content = <Outlet />;
  }

  return content;
};
export default PersistLogin;

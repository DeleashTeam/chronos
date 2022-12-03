import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login.page';
import PersistLogin from './features/auth/persistLogin';
import RegisterPage from './pages/Register.page';
import CalendarPage from './pages/Calendars.page';
import UnknownPage from './pages/Unknown.page';
import PasswordResetPage from './pages/PasswordReset.page';
import ConfirmEmailPage from './pages/ConfirmEmail.page';
import JoinCalendarPage from './pages/JoinCalendar';
import EventPage from './pages/Event.page';
import HomePage from './pages/Home.page';
import JoinEventPage from './pages/JoinEvent';

const useRoutes = (isAuthenticated) => (
  <Routes>
    <Route element={<PersistLogin />}>
      {isAuthenticated ? (
        <>
          <Route path="/" element={<HomePage />} />
          <Route path="/calendars" element={<CalendarPage />} />
          <Route path="/register" element={<Navigate to="/calendars" replace />} />
          <Route path="/login" element={<Navigate to="/calendars" replace />} />
          <Route path="/unknown" element={<UnknownPage />} />
          <Route path="/calendars/join/:calendarId" element={<JoinCalendarPage />} />
          <Route path="/events/join/:eventId" element={<JoinEventPage />} />
          <Route path="/event/:eventId" element={<EventPage />} />
          <Route path="*" element={<Navigate to="/unknown" replace />} />
        </>
      ) : (
        <>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/password-reset/:token" element={<PasswordResetPage />} />
          <Route path="/confirmEmail" element={<ConfirmEmailPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}
    </Route>
  </Routes>
);

export default useRoutes;

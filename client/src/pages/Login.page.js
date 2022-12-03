import Header from '../components/auth/FormHeader';
import Login from '../components/auth/Login';

const LoginPage = () => (
  <div className="min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8">
      <Header
        heading="Login to your account"
        paragraph="Don't have an account yet?"
        linkName="Sign Up"
        linkUrl="/register"
      />
      <Login />
    </div>
  </div>
);

export default LoginPage;

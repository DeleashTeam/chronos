import ForgotPasswordModal from './ForgotPasswordModal';
import usePersist from '../../hooks/usePersist';

const FormExtra = () => {
  const [, setPersist] = usePersist();
  const handleClick = () => setPersist((prev) => !prev);

  return (
    <div className="flex items-center justify-between ">
      <div className="flex items-center">
        <input
          id="remember-me"
          name="remember-me"
          onChange={handleClick}
          type="checkbox"
          className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
        />
        <label htmlFor="remember-me" className="ml-2 block text-sm text-white">
          Remember me
        </label>
      </div>

      <div className="text-sm">
        <ForgotPasswordModal />
      </div>
    </div>
  );
};

export default FormExtra;

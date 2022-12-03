import { Fragment, useState } from 'react';
import {
  Modal, Label, TextInput, Spinner,
} from 'flowbite-react';
import { HiUpload } from 'react-icons/hi';
import { useUpdateUserMutation, useUpdateAvatarMutation } from '../../features/user/userApi.slice';
import { useRefreshMutation } from '../../features/auth/authApi.slice';

const initialErrorState = {
  login: '',
  name: '',
  email: '',
  avatar: '',
  password: '',
  confirmPassword: '',
};

const SettingsModal = ({ user }) => {
  const [updateUser, updateUserState] = useUpdateUserMutation();
  const [updateAvatar, updateAvatarState] = useUpdateAvatarMutation();
  const [refresh, refreshState] = useRefreshMutation();
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(initialErrorState);
  const [formState, setFormState] = useState({
    login: user.login,
    name: user.name,
    email: user.email,
    avatar: user.profilePicture,
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setError(initialErrorState);
    if (e.target.name === 'avatar') {
      const url = URL.createObjectURL(e.target.files[0]);
      setFormState({
        ...formState,
        [e.target.name]: url,
        file: e.target.files[0],
      });
    } else setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const onSaveChanges = () => {
    const inputs = {
      ...(formState.login !== user.login ? { login: formState.login } : {}),
      ...(formState.name !== user.name ? { name: formState.name } : {}),
      ...(formState.email !== user.email ? { email: formState.email } : {}),
      ...(formState.password !== '' ? { password: formState.password } : {}),
      ...(formState.confirmPassword !== '' ? { confirmPassword: formState.confirmPassword } : {}),
    };
    if (
      formState.password > 0
      && (formState.password.length < 3 || formState.password !== formState.confirmPassword)
    ) setError({ ...error, password: 'Password is too short or Confirm Password is different' });
    else {
      if (formState.file) {
        const fd = new FormData();
        fd.append('avatar', formState.file);
        updateAvatar(fd);
      }
      if (Object.keys(inputs).length) updateUser(inputs);
      refresh();
    }
  };

  return (
    <Fragment>
      <span
        className="w-full h-full"
        onClick={() => {
          setShowModal(!showModal);
        }}
      >
        Settings
      </span>

      <Modal
        show={showModal}
        size="xl"
        popup={true}
        onClose={() => {
          setShowModal(!showModal);
        }}
      >
        <Modal.Header className="mt-10 bg-gray-900">
          <div className="m-2 text-gray-400">Settings</div>
        </Modal.Header>
        <Modal.Body className="bg-gray-900">
          {updateUserState.isLoading || refreshState.isLoading || updateAvatarState.isLoading ? (
            <div className="flex justify-center items-center">
              <Spinner color="success" size="xl" />
            </div>
          ) : (
            <div className="space-y-6 px-6">
              <div className="flex items-center justify-center w-full">
                <img
                  // crossOrigin="anonymous"
                  src={formState.avatar}
                  className="z-20 hover:z-0 rounded-full w-1/3 shadow-md border-4 border-white"
                ></img>
                <div className=" opacity-0 top-30 z-10 hover:z-30 absolute flex justify-center items-center transition duration-400 transform hover:opacity-80">
                  <label
                    htmlFor="dropzone-file"
                    className=" flex items-center w-2/3 p-3 justify-center rounded-full cursor-pointer bg-gray-700"
                  >
                    <div className="flex flex-col justify-center items-center pt-5 pb-6">
                      <HiUpload color="white" size="35" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload or drag and drop</span>
                      </p>
                    </div>
                    <input
                      name="avatar"
                      id="dropzone-file"
                      onChange={handleChange}
                      accept="image/*"
                      type="file"
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="base" value="Login" />
                  </div>
                  <TextInput
                    name="login"
                    onChange={handleChange}
                    value={formState.login}
                    type="text"
                    sizing="md"
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="base" value="Full name" />
                  </div>
                  <TextInput
                    name="name"
                    onChange={handleChange}
                    value={formState.name}
                    type="text"
                    sizing="md"
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="base" value="Email" />
                  </div>
                  <TextInput
                    name="email"
                    onChange={handleChange}
                    value={formState.email}
                    type="text"
                    sizing="md"
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="base" value="Password" />
                  </div>
                  <TextInput
                    name="password"
                    onChange={handleChange}
                    value={formState.password}
                    helperText={<span className="text-red-500">{error.password}</span>}
                    type="password"
                    sizing="md"
                  />
                  <TextInput
                    name="confirmPassword"
                    onChange={handleChange}
                    value={formState.confirmPassword}
                    helperText={<span className="text-red-500">{error.confirmPassword}</span>}
                    type="password"
                    sizing="md"
                  />
                </div>
              </div>
              <div
                onClick={onSaveChanges}
                className="mt-5 w-full p-3 bg-gray-900 hover:border-white border-orange-500 text-orange-500 text-center rounded-xl border-2 cursor-pointer text-md md:text-xl hover:text-gray-300 font-bold"
              >
                Save changes
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </Fragment>
  );
};

export default SettingsModal;

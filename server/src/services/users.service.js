const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const { dbResponse, createLink, deletePreviousFile } = require('../utils');

const usersErrors = Object.freeze({
  wrongFields: 'Wrong fields',
  noUserFound: 'No user found',
  userAlreadyExists: 'User already exists',
  fileUploadError: 'File upload error',
});

const defaultSelectParams = {
  page: 1,
  pageSize: 5,
  search: '',
};

async function getAll(selectParams = defaultSelectParams) {
  const skip = (selectParams.page - 1) * selectParams.pageSize;
  const limit = selectParams.pageSize;
  const users = await User.find({
    $or: [
      { login: { $regex: selectParams.search, $options: 'i' } },
      { name: { $regex: selectParams.search, $options: 'i' } },
    ],
  })
    .skip(skip)
    .limit(limit)
    .select('name login email profilePicture');
  return { data: { users, message: 'Users retrieval successful' } };
}

async function getOne(login) {
  const user = await User.findOne({ login });
  if (!user) return { error: { type: usersErrors.noUserFound, message: 'No user with such login' } };
  return {
    data: {
      message: 'User retrieval successful',
      user: dbResponse(user, 'name', 'login', 'email', 'profilePicture'),
    },
  };
}

async function update(user, userData) {
  const data = {
    ...(userData.login ? { login: userData.login } : {}),
    ...(userData.password
      ? { passwordHash: bcrypt.hashSync(userData.password, bcrypt.genSaltSync(10)) }
      : {}),
    ...(userData.email ? { email: userData.email } : {}),
    ...(userData.name ? { name: userData.name } : {}),
  };
  if (data.login || data.email) {
    const dbUser = await User.findOne({ $or: [{ login: data.login }, { email: data.email }] });
    if (dbUser) {
      return {
        error: {
          type: usersErrors.userAlreadyExists,
          message: `User with such ${data.login ? 'login' : 'email'} already exists`,
        },
      };
    }
  }

  if (data.email) data.emailConfirm = false;
  if (data.name || data.passwordHash) {
    await User.findByIdAndUpdate(user, data);
  }
  return { data: { message: 'User data update successful' } };
}

async function updateAvatar(user, avatar) {
  const profilePicture = createLink(avatar);
  await User.findByIdAndUpdate(user, { profilePicture });
  deletePreviousFile(user);
  return { data: { message: 'Avatar update successful' } };
}

async function remove(user) {
  await User.findByIdAndRemove(user);
  return { data: { message: 'User successfully removed' } };
}

module.exports = {
  getAll,
  getOne,
  remove,
  update,
  updateAvatar,
  usersErrors,
};

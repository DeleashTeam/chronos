const Joi = require('joi');
const { usersErrors, ...usersService } = require('../services/users.service');

function getStatusCode(error) {
  switch (error.type) {
    case usersErrors.noUserFound || usersErrors.wrongFields:
      return 400;
    case usersErrors.userAlreadyExists:
      return 403;
    default:
      return 500;
  }
}

const userDataValidationSchema = Joi.object({
  login: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .messages({
      'string.min': 'Login should be at least 3 characters long',
      'string.max': 'Login should be at most 30 characters long',
    }),
  name: Joi.string()
    .min(6)
    .max(50),
  password: Joi.string()
    .min(6)
    .max(50)
    .messages({
      'string.min': 'Password should be at least 6 characters long',
      'string.max': 'Password should be at most 50 characters long',
    }),
  confirmPassword: Joi.any()
    .valid(Joi.ref('password'))
    .messages({
      'any.only': 'Passwords must be exactly the same',
    }),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .messages({
      'string.email': "Email should contain '@' and end with '.net' or '.com'",
    }),
}).with('password', 'confirmPassword');

async function getAll(req, res) {
  try {
    const { page, pageSize, search } = req.query;
    const selectParams = {
      ...(page ? { page } : { page: 1 }),
      ...(pageSize ? { pageSize } : { pageSize: 10 }),
      ...(search ? { search } : { search: '' }),
    };
    const { error, data } = await usersService.getAll(selectParams);
    if (error) return res.status(getStatusCode(error)).json(error);
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'An error occurred during users retrieval' });
  }
}

async function getOne(req, res) {
  try {
    const { login } = req.params;
    const { error, data } = await usersService.getOne(login);
    if (error) return res.status(getStatusCode(error)).json(error);
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'An error occurred during user retrieval' });
  }
}

async function update(req, res) {
  try {
    const { user } = req;
    const userData = req.body;
    const validationResult = userDataValidationSchema.validate(userData);
    if (validationResult.error) {
      return res
        .status(getStatusCode(usersErrors.wrongFields))
        .json({ type: usersErrors.wrongFields, message: validationResult.error.message });
    }
    const { error, data } = await usersService.update(user, userData);
    if (error) return res.status(getStatusCode(error)).json(error);
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'An error occurred during user update' });
  }
}

async function updateAvatar(req, res) {
  try {
    const { file, user } = req;
    if (!file) {
      return res
        .status(415)
        .json({ type: usersErrors.fileUploadError, message: 'An error occurred during file upload' });
    }
    const { error, data } = await usersService.updateAvatar(user, file.filename);
    if (error) return res.status(getStatusCode(error)).json(error);
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'An error occurred during user avatar update' });
  }
}

async function remove(req, res) {
  try {
    const { user } = req;
    const { error, data } = await usersService.remove(user);
    if (error) return res.status(getStatusCode(error)).json(error);
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'An error occurred during user deletion' });
  }
}

module.exports = {
  update,
  remove,
  getOne,
  getAll,
  updateAvatar,
};

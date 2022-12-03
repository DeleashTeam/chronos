/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const sendEmailConfirmationMail = require('../mailer/emailConfirmation');
const sendPasswordResetMail = require('../mailer/passwordReset');

const { dbResponse } = require('../utils');
const generateUniqueLogin = require('../utils/generateUniqueLogin.util');
const { calendarsService } = require('.');

const authErrors = Object.freeze({
  userAlreadyExists: 'User exists',
  noUserWithEmail: 'No User found',
  wrongUserFields: 'Wrong user fields',
  jwtExpired: 'Link expired',
  emailAlreadyConfirmed: 'Email confirmed',
  emailNotConfirmed: 'Email is not confirmed',
  unauthorized: 'Unauthorized',
});

const emailValidationSchema = Joi.string()
  .required()
  .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
  .messages({
    'any.required': 'Email field cannot be empty',
    'string.email': "Email should contain '@' and end with '.net' or '.com'",
  });

const loginValidationSchema = Joi.string()
  .alphanum()
  .min(3)
  .max(30)
  .required()
  .messages({
    'string.min': 'Login should be at least 3 characters long',
    'string.max': 'Login should be at most 30 characters long',
    'string.empty': 'Login should be at least 3 characters long',
  });

const passwordValidationSchema = Joi.string()
  .min(6)
  .max(50)
  .required()
  .messages({
    'string.min': 'Password should be at least 6 characters long',
    'string.max': 'Password should be at most 50 characters long',
    'any.required': 'Password field cannot be empty',
  });

const userValidationSchema = Joi.object({
  login: loginValidationSchema,
  password: passwordValidationSchema,
  confirmPassword: Joi.any()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords must be exactly the same',
    }),
  name: Joi.string().min(2).max(20),
  email: emailValidationSchema,
});

async function login({ email, password }) {
  const emailValidation = emailValidationSchema.validate(email);
  const passwordValidation = passwordValidationSchema.validate(password);
  if (emailValidation.error || passwordValidation.error) {
    return {
      error: {
        type: authErrors.wrongUserFields,
        message: emailValidation.error?.message || passwordValidation.error?.message,
      },
    };
  }

  const user = await User.findOne({ email });
  if (!user) {
    return {
      error: { type: authErrors.noUserWithEmail, message: 'There is no user with such email' },
    };
  }

  if (!user.passwordHash) return { error: { type: authErrors.wrongUserFields, message: 'Wrong password' } };
  const isMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!isMatch) {
    return { error: { type: authErrors.wrongUserFields, message: 'Wrong password' } };
  }

  const accessToken = jwt.sign(
    {
      id: user._id,
      login: user.login,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
  );

  const refreshToken = jwt.sign(
    {
      id: user._id,
      login: user.login,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE },
  );

  return {
    refreshToken,
    data: {
      message: 'User authorized',
      accessToken,
      user: dbResponse(user, 'name', 'login', 'email', 'profilePicture', 'emailConfirm'),
    },
  };
}

async function refresh(refreshToken) {
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findOne({ login: decoded.login });

    if (!user) return { error: { type: authErrors.unauthorized, message: 'No user for this link' } };

    const accessToken = jwt.sign(
      {
        id: user._id,
        login: user.login,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
    );

    return {
      data: {
        message: 'Token refreshed',
        accessToken,
        user: dbResponse(user, 'name', 'login', 'email', 'profilePicture', 'emailConfirm'),
      },
    };
  } catch (error) {
    console.log(error);
    return { error: { type: authErrors.jwtExpired, message: 'Token has expired' } };
  }
}

async function register(user) {
  const { error } = userValidationSchema.validate(user);
  if (error) return { error: { type: authErrors.wrongUserFields, message: error.message } };
  const userObj = {
    login: user.login,
    name: user.name,
    email: user.email,
  };
  const dbUser = await User.findOne({ $or: [{ email: userObj.email }, { login: userObj.login }] });
  if (dbUser) {
    return {
      error: {
        type: authErrors.userAlreadyExists,
        message: 'User with such login or email already exists',
      },
    };
  }

  const salt = bcrypt.genSaltSync(10);
  userObj.passwordHash = bcrypt.hashSync(user.password, salt);

  const newUser = await User.create(userObj);

  // TODO: change country
  calendarsService.createDefaultCalendar(newUser, 'UA');

  const emailConfirmationToken = jwt.sign({ login: userObj.login }, process.env.JWT_EMAIL_SECRET, {
    expiresIn: process.env.JWT_EMAIL_SECRET_EXPIRE,
  });

  await sendEmailConfirmationMail(emailConfirmationToken, userObj);
  return { data: { message: 'User registration successful' } };
}

async function googleAuth(user) {
  let dbUser = await User.findOne({ email: user.email });
  if (!dbUser) {
    const userObj = {
      login: await generateUniqueLogin(user.email.split('@')[0]),
      name: user.name,
      email: user.email,
      emailConfirm: true,
      profilePicture: user.picture,
    };
    dbUser = await User.create(userObj);
    calendarsService.createDefaultCalendar(dbUser, 'UA');
  }
  if (!dbUser.emailConfirm) {
    await User.findOneAndUpdate(
      { email: dbUser.email },
      { emailConfirm: true, name: user.name },
    );
  }
  const accessToken = jwt.sign(
    {
      id: dbUser._id,
      login: dbUser.login,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
  );

  const refreshToken = jwt.sign(
    {
      id: dbUser._id,
      login: dbUser.login,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE },
  );

  return {
    refreshToken,
    data: {
      message: 'User authorized',
      accessToken,
      user: dbResponse(dbUser, 'name', 'login', 'email', 'profilePicture', 'emailConfirm'),
    },
  };
}

async function requestEmailConfirmation(email) {
  const { error } = emailValidationSchema.validate(email);
  if (error) {
    console.log(error);
    return { error: { type: authErrors.emailAlreadyConfirmed, message: error.message } };
  }
  const user = await User.findOne({ email });
  if (user.emailConfirm) {
    return {
      error: { type: authErrors.emailAlreadyConfirmed, message: 'Email is already confirmed' },
    };
  }
  if (!user) {
    return { error: { type: authErrors.noUserWithEmail, message: 'There is no user with such email' } };
  }
  const emailConfirmationToken = jwt.sign({ login: user.login }, process.env.JWT_EMAIL_SECRET, {
    expiresIn: process.env.JWT_EMAIL_SECRET_EXPIRE,
  });
  await sendEmailConfirmationMail(emailConfirmationToken, user);
  return { data: { message: 'Confirmation email has been sent' } };
}

async function confirmEmail(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_EMAIL_SECRET);
    await User.findOneAndUpdate({ login: decoded.login }, { emailConfirm: true });
    return { data: { message: 'Email confirmed' } };
  } catch (error) {
    console.log(error);
    return { error: { type: authErrors.jwtExpired, message: 'Token has expired' } };
  }
}

async function requestPasswordReset(email) {
  const { error } = emailValidationSchema.validate(email);
  if (error) return { error: { type: authErrors.wrongUserFields, message: error.message } };
  const user = await User.findOne({ email });
  if (!user) {
    return {
      error: { type: authErrors.noUserWithEmail, message: 'There is no user with such email' },
    };
  }

  const passwordResetToken = jwt.sign({ login: user.login }, process.env.JWT_EMAIL_SECRET, {
    expiresIn: process.env.JWT_EMAIL_SECRET_EXPIRE,
  });

  await sendPasswordResetMail(passwordResetToken, user);

  return { data: { message: 'Password reset link has been sent' } };
}

async function resetPassword(password, confirmPassword, token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_EMAIL_SECRET);

    const user = User.findOne({ login: decoded.login });
    if (!user) {
      return {
        error: { type: authErrors.noUserWithEmail, message: 'There is no user with such email' },
      };
    }

    const { error } = passwordValidationSchema.validate(password);
    if (error) return { error: { type: authErrors.wrongUserFields, message: error.message } };

    if (password !== confirmPassword) {
      return {
        error: {
          type: authErrors.wrongUserFields,
          message: 'Password and confirm password should be exactly the same',
        },
      };
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    await User.updateOne(user, { passwordHash });
    return { data: { message: 'Password has been updated' } };
  } catch (error) {
    console.log(error);
    return { error: { type: authErrors.jwtExpired, message: 'Token has expired' } };
  }
}

module.exports = {
  login,
  refresh,
  register,
  authErrors,
  googleAuth,
  confirmEmail,
  resetPassword,
  requestPasswordReset,
  requestEmailConfirmation,
};

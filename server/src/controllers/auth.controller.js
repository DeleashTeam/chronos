const authService = require('../services/auth.service');
const { authErrors } = require('../services/auth.service');
const { getGoogleProfile } = require('../utils');

function getStatusCode(error) {
  switch (error.type) {
    case authErrors.noUserWithEmail || authErrors.wrongUserFields:
      return 400;
    case authErrors.unauthorized || authErrors.emailNotConfirmed || authErrors.jwtExpired:
      return 401;
    case authErrors.emailAlreadyConfirmed || authErrors.userAlreadyExists:
      return 403;
    default:
      return 500;
  }
}

async function googleAuth(req, res) {
  try {
    const user = await getGoogleProfile(req.body.accessToken);
    const { refreshToken, error, data } = await authService.googleAuth(user);
    if (error) return res.status(getStatusCode(error)).json(error);
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    return res
      .cookie('jwt', refreshToken, cookieOptions)
      .cookie('logged_in', true, { ...cookieOptions, httpOnly: false })
      .status(200)
      .json(data);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: 'An error has occurred during google user authentication' });
  }
}
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const { error, data, refreshToken } = await authService.login({ email, password });
    if (error) return res.status(getStatusCode(error)).json(error);

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    return res
      .cookie('jwt', refreshToken, cookieOptions)
      .cookie('logged_in', true, { ...cookieOptions, httpOnly: false })
      .status(200)
      .json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'An error has occurred during user authentication' });
  }
}

async function logout(req, res) {
  const { cookies } = req;
  if (!cookies?.jwt) return res.sendStatus(204);

  return res
    .clearCookie('jwt', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })
    .json({ message: 'Logout successful' });
}

async function refresh(req, res) {
  try {
    const { cookies } = req;
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });

    const refreshToken = cookies.jwt;
    const { error, data } = await authService.refresh(refreshToken);

    if (error) {
      return res
        .clearCookie('jwt', {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        })
        .clearCookie('logged_in', { httpOnly: false, secure: true, sameSite: 'none' })
        .status(getStatusCode(error))
        .json(error);
    }

    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'An error has occurred during token refresh' });
  }
}

async function register(req, res) {
  try {
    const { error, data } = await authService.register(req.body);
    if (error) return res.status(getStatusCode(error)).json(error);

    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'An error has occurred during user registration' });
  }
}

async function confirmEmail(req, res) {
  try {
    const { token } = req.params;
    const { error, data } = await authService.confirmEmail(token);
    if (error) {
      return res
        .status(getStatusCode(error))
        .redirect(
          `${process.env.CLIENT_LINK}/confirmEmail?status=${getStatusCode(error)}&message=${
            error.message
          }`,
        );
    }

    return res
      .status(200)
      .redirect(`${process.env.CLIENT_LINK}/confirmEmail?status=200&message=${data.message}`);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'An error has occurred during user email confirmation' });
  }
}

async function requestEmailConfirmation(req, res) {
  try {
    const { email } = req.body;
    const { error, data } = await authService.requestEmailConfirmation(email);
    if (error) return res.status(getStatusCode(error)).json(error);

    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: 'An error has occurred during email confirmation request' });
  }
}

async function requestPasswordReset(req, res) {
  try {
    const { email } = req.body;
    const { error, data } = await authService.requestPasswordReset(email);
    if (error) return res.status(getStatusCode(error)).json(error);

    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'An error has occurred during password reset request' });
  }
}

async function resetPassword(req, res) {
  try {
    const { password, confirmPassword } = req.body;
    const { token } = req.params;
    const { error, data } = await authService.resetPassword(password, confirmPassword, token);
    if (error) return res.status(getStatusCode(error)).json(error);

    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'An error has occurred during password reset' });
  }
}

module.exports = {
  login,
  logout,
  refresh,
  register,
  googleAuth,
  confirmEmail,
  resetPassword,
  requestPasswordReset,
  requestEmailConfirmation,
};

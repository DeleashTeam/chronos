const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const { auth } = require('../middleware');

const router = Router();

/**
 *  @route    POST /api/auth/login
 *  @desc     credentials authentication
 */
router.post('/login', authController.login);

/**
 *  @route    POST /api/auth/logout
 *  @desc     logout authorized user
 */
router.post('/logout', auth, authController.logout);

/**
 *  @route    GET /api/auth/refresh
 *  @desc     refresh access token
 */
router.get('/refresh', authController.refresh);

/**
 *  @route    POST /api/auth/confirm-email
 *  @desc     send email confirmation mail
 */
router.post('/confirm-email', authController.requestEmailConfirmation);

/**
 *  @route    GET /api/auth/confirm-email/:token
 *  @desc     confirm email with link
 */
router.get('/confirm-email/:token', authController.confirmEmail);

/**
 *  @route    GET /api/auth/password-reset
 *  @desc     send password confirmation mail
 */
router.post('/password-reset', authController.requestPasswordReset);

/**
 *  @route    POST /api/auth/password-reset/:token
 *  @desc     reset password using link
 */
router.post('/password-reset/:token', authController.resetPassword);

/**
 *  @route    POST /api/auth/google
 *  @desc     google authentication
 */
router.post(
  '/google',
  authController.googleAuth,
);

/**
 *  @route    POST /api/auth/register
 *  @desc     register new user
 */
router.post('/register', authController.register);

module.exports = router;

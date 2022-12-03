const { Router } = require('express');
const usersController = require('../controllers/users.controller');

const { auth, upload } = require('../middleware');

const router = new Router();

router.use(auth);
/**
 *  @route    GET /api/users
 *  @desc     get all users
 */
router.get('/', usersController.getAll);
/**
 *  @route    GET /api/users/:login
 *  @desc     get one user
 */
router.get('/:login', usersController.getOne);
/**
 *  @route    PATCH /api/users
 *  @desc     update authorized user
 */
router.patch('/', usersController.update);
/**
 *  @route    PATCH /api/users/avatar
 *  @desc     update authorized user avatar
 */
router.patch('/avatar', upload.single('avatar'), usersController.updateAvatar);
/**
 *  @route    DELETE /api/users
 *  @desc     remove authorized user
 */
router.delete('/', usersController.remove);

module.exports = router;

const { Router } = require('express');
const { auth } = require('../middleware');
const { eventsController } = require('../controllers');

const router = Router();

router.use(auth);

router.get('/:id', eventsController.get);
router.get('/join/:token', eventsController.join);
router.patch('/:id', eventsController.update);
router.post('/:id/user', eventsController.addUser);
router.delete('/:id/user', eventsController.removeUser);
router.delete('/:id', eventsController.remove);
router.post('/:id/toggleAdmin', eventsController.toggleAdmin);

module.exports = router;

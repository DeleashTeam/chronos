const { Router } = require('express');
const { auth } = require('../middleware');
const { calendarsController } = require('../controllers');

const router = Router();

router.use(auth);

router.get('/', calendarsController.getAll);
router.get('/join/:token', calendarsController.join);
router.get('/:id', calendarsController.get);
router.patch('/:id', calendarsController.update);
router.post('/', calendarsController.create);
router.delete('/:id', calendarsController.remove);
router.get('/:id/getEvents', calendarsController.getEvents);
router.post('/:id/event', calendarsController.addEvent);
router.post('/:id/user', calendarsController.addUser);
router.delete('/:id/user', calendarsController.removeUser);
router.post('/:id/toggleAdmin', calendarsController.toggleAdmin);

module.exports = router;

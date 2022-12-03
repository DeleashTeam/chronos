const { Router } = require('express');
const root = require('./root.route');
const auth = require('./auth.route');
const calendars = require('./calendars.route');
const users = require('./users.route');
const events = require('./events.route');

const router = Router();

router.use('/', root);
router.use('/auth', auth);
router.use('/calendars', calendars);
router.use('/users', users);
router.use('/events', events);

module.exports = router;

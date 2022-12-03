const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;
const { eventsService } = require('../services');

/**
 *
 * @param {Number} error
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function handleError(error, res) {
  if (error === eventsService.errors.EventNotFound) {
    return res.status(404).json({ status: 404, error: 'Event not found' });
  }
  if (error === eventsService.errors.UserNotFound) {
    return res.status(404).json({ status: 404, error: 'User not found' });
  }
  if (error === eventsService.errors.UnableToChangeUserList) {
    return res.status(400).json({ status: 400, error: 'Unable to change users list' });
  }
  if (error === eventsService.errors.UnableToDeleteEvent) {
    return res.status(400).json({ status: 400, error: 'Unable to delete event' });
  }
  if (error === eventsService.errors.UnableToDeleteThisUser) {
    return res.status(400).json({ status: 400, error: 'Unable to delete this user' });
  }
  if (error === eventsService.errors.UserAlreadyAdded) {
    return res.status(400).json({ status: 400, error: 'User already added' });
  }
  if (error === eventsService.errors.UnableToChangeEvent) {
    return res.status(400).json({ status: 400, error: 'Unable to change event' });
  }

  if (error === eventsService.errors.UnableToChangeAdminList) {
    return res.status(400).json({ status: 400, error: 'Unable to change admin list' });
  }

  throw error;
}

const getAndDeleteEventValidationSchema = Joi.object({
  params: {
    id: Joi.string()
      .required()
      .custom((value, helper) => {
        if (ObjectId.isValid(value)) {
          return true;
        }
        return helper.message('id must be a valid object id');
      }),
  },
}).unknown(true);

async function get(req, res, next) {
  try {
    const { error } = getAndDeleteEventValidationSchema.validate(req);
    if (error) {
      return res.status(400).json({
        status: 400,
        error: error.message,
      });
    }

    const { user } = req;
    const { id } = req.params;

    const { event, error: getError } = await eventsService.get({ user, id });
    if (typeof getError === 'number') return handleError(getError, res);

    res.json({ status: 200, message: 'successful event getting', data: { event } });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const { error } = getAndDeleteEventValidationSchema.validate(req);
    if (error) {
      return res.status(400).json({
        status: 400,
        error: error.message,
      });
    }

    const { user } = req;
    const { id } = req.params;

    const { error: removeError } = await eventsService.remove({ user, id });

    if (removeError) {
      return handleError(removeError, res);
    }

    return res.json({ status: 200, message: 'successful event deleting' });
  } catch (error) {
    return next(error);
  }
}

// TODO: add another colors
const validColors = ['#D50000', '#E67C73', '#F4511E', '#F6BF26', '#33B679'];
const validEventTypes = ['arrangement', 'holiday', 'reminder', 'task'];
const validFrequencies = ['day', 'week', 'month', 'year'];

const updateEventValidationSchema = Joi.object({
  params: {
    id: Joi.string()
      .required()
      .custom((value, helper) => {
        if (ObjectId.isValid(value)) {
          return true;
        }
        return helper.message('id must be a valid object id');
      }),
  },
  body: {
    name: Joi.string(),
    executorLogin: Joi.string(),
    color: Joi.string().valid(...validColors),
    type: Joi.string().valid(...validEventTypes),
    startAt: Joi.date().iso(),
    endAt: Joi.date().iso(),
    rrule: Joi.string(),
    duration: Joi.number(),
    frequency: Joi.string().valid(...validFrequencies),
    notification: Joi.boolean(),
    description: Joi.string(),
  },
}).unknown(true);

async function update(req, res, next) {
  try {
    const { error } = updateEventValidationSchema.validate(req);
    if (error) {
      return res.status(400).json({
        status: 400,
        error: error.message,
      });
    }

    const { user } = req;
    const { id } = req.params;
    const eventData = req.body;

    const { error: updateError, event } = await eventsService.update({ user, id, eventData });
    if (typeof updateError === 'number') return handleError(updateError, res);

    res.json({ status: 200, message: 'successfully event updating', data: { event } });
  } catch (error) {
    next(error);
  }
}

const addAndDeleteUserValidationSchema = Joi.object({
  body: Joi.object({
    login: Joi.string().required(),
  }),
  params: Joi.object({
    id: Joi.string()
      .required()
      .custom((value, helper) => {
        if (ObjectId.isValid(value)) {
          return true;
        }
        return helper.message('params.id must be a valid object id');
      }),
  }),
}).unknown(true);

async function addUser(req, res, next) {
  try {
    const { error } = addAndDeleteUserValidationSchema.validate(req);
    if (error) {
      return res.status(400).json({
        status: 400,
        error: error.message,
      });
    }

    const { user } = req;
    const { id } = req.params;
    const { login: addingUserLogin } = req.body;

    const { error: updateError, event, addingUser } = await eventsService.addUser({
      user,
      id,
      addingUserLogin,
    });
    if (typeof updateError === 'number') return handleError(updateError, res);

    res.json({
      status: 200,
      message: 'successfully user adding',
      data: { event, addingUser: { ...addingUser, passwordHash: undefined } },
    });
  } catch (error) {
    next(error);
  }
}

async function removeUser(req, res, next) {
  try {
    const { error } = addAndDeleteUserValidationSchema.validate(req);
    if (error) {
      return res.status(400).json({
        status: 400,
        error: error.message,
      });
    }

    const { user } = req;
    const { id } = req.params;
    const { login: removingUserLogin } = req.body;

    const { error: removeUserError } = await eventsService.removeUser({
      user,
      id,
      removingUserLogin,
    });
    if (typeof removeUserError === 'number') return handleError(removeUserError, res);

    return res.json({ status: 200, message: 'successful user deleting' });
  } catch (error) {
    return next(error);
  }
}

const changeUserListValidationSchema = Joi.object({
  body: Joi.object({
    login: Joi.string().required(),
  }),
  params: Joi.object({
    id: Joi.string()
      .required()
      .custom((value, helper) => {
        if (ObjectId.isValid(value)) {
          return true;
        }
        return helper.message('params.id must be a valid object id');
      }),
  }),
}).unknown(true);

async function toggleAdmin(req, res, next) {
  try {
    const { error } = changeUserListValidationSchema.validate(req);
    if (error) {
      return res.status(400).json({
        status: 400,
        error: error.message,
      });
    }
    const { user } = req;
    const { id } = req.params;
    const { login: togglingUserLogin } = req.body;

    const { event, togglingUser, error: toggleError } = await eventsService.toggleAdmin({
      user,
      id,
      togglingUserLogin,
    });

    if (toggleError) return handleError(toggleError, res);

    res.json({
      status: 200,
      message: 'successful admin toggling',
      data: { event, togglingUser: { ...togglingUser, passwordHash: undefined } },
    });
  } catch (error) {
    next(error);
  }
}

const joinValidationSchema = Joi.object({
  params: {
    token: Joi.string().required(),
  },
}).unknown(true);

async function join(req, res, next) {
  try {
    const { error } = joinValidationSchema.validate(req);
    if (error) {
      return res.status(400).json({
        status: 400,
        error: error.message,
      });
    }

    const { user } = req;
    const { token } = req.params;

    const { event, error: joinError } = await eventsService.join({ user, token });

    if (typeof joinError === 'number') return handleError(joinError, res);

    return res.json({ status: 200, message: 'successful user joining', data: { event } });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  get,
  update,
  addUser,
  removeUser,
  remove,
  toggleAdmin,
  join,
};

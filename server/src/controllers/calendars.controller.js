const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;
const { calendarsService } = require('../services');

// pagination { page, pageSize }
// populated fields
// filter: { my, calendarName }
// sort { createdAt, nearestEvents }

/**
 *
 * @param {Number} error
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function handleError(error, res) {
  if (error === calendarsService.errors.CalendarNotFound) {
    return res.status(404).json({ status: 404, error: 'Calendar not found' });
  }
  if (error === calendarsService.errors.UserNotFound) {
    return res.status(404).json({ status: 404, error: 'User not found' });
  }

  if (error === calendarsService.errors.UnableToAddEvent) {
    return res.status(400).json({ status: 400, error: 'Unable to add event' });
  }
  if (error === calendarsService.errors.UnableToChangeUserList) {
    return res.status(400).json({ status: 400, error: 'Unable to change users list' });
  }
  if (error === calendarsService.errors.UnableToDeleteCalendar) {
    return res.status(400).json({ status: 400, error: 'Unable to delete calendar' });
  }
  if (error === calendarsService.errors.UnableToDeleteThisUser) {
    return res.status(400).json({ status: 400, error: 'Unable to delete this user' });
  }
  if (error === calendarsService.errors.UserAlreadyAdded) {
    return res.status(400).json({ status: 400, error: 'User already added' });
  }
  if (error === calendarsService.errors.UnableToChangeAdminList) {
    return res.status(400).json({ status: 400, error: 'Unable to change admins list' });
  }
  if (error === calendarsService.errors.UnableToChangeCalendar) {
    return res.status(400).json({ status: 400, error: 'Unable to change calendar' });
  }

  throw error;
}

const idValidation = Joi.string()
  .required()
  .custom((value, helper) => {
    if (ObjectId.isValid(value)) {
      return true;
    }
    return helper.message('params.id must be a valid object id');
  });

const validPopulated = ['events', 'users', 'admins', 'creator'];

const getAllValidationSchema = Joi.object({
  query: Joi.object({
    page: Joi.number()
      .min(1)
      .default(1),
    pageSize: Joi.number()
      .min(1)
      .default(5),
    populated: [
      Joi.array()
        .items(Joi.string().valid(...validPopulated))
        .default([]),
      Joi.string().valid(...validPopulated),
    ],
    calendarName: Joi.string(),
    createdByMe: Joi.boolean().default(false),
    sortBy: Joi.string().valid('createdAt', 'nearestEvents'),
  }),
}).unknown(true);

function createSelectParameters(query) {
  const selectParameters = {};
  selectParameters.pagination = {
    page: query.page,
    pageSize: query.pageSize,
  };
  selectParameters.populated = query.populated;
  selectParameters.my = query.createdByMe;
  if (query.calendarName) selectParameters.name = query.calendarName;
  if (query.sortBy) selectParameters.sort = query.sortBy;
  return selectParameters;
}

async function getAll(req, res, next) {
  try {
    const { error, value } = getAllValidationSchema.validate(req);
    if (error) {
      return res.status(400).json({
        status: 400,
        error: error.message,
      });
    }
    req.query = value.query;
    const { user } = req;
    const selectParameters = createSelectParameters(req.query);
    const { calendars } = await calendarsService.getAll({
      user,
      selectParameters,
    });

    res.json({
      status: 200,
      message: 'Success get calendars',
      data: { calendars },
    });
  } catch (error) {
    next(error);
  }
}

const createCalendarValidationSchema = Joi.object({
  body: Joi.object({
    name: Joi.string()
      .min(1)
      .required(),
    description: Joi.string().default(''),
  }),
}).unknown(true);

async function create(req, res, next) {
  try {
    const { error } = createCalendarValidationSchema.validate(req);
    if (error) {
      return res.status(400).json({
        status: 400,
        error: error.message,
      });
    }
    const { user } = req;
    const { calendar, error: creationError } = await calendarsService.create({
      user,
      name: req.body.name,
      description: req.body.description,
    });

    if (typeof creationError === 'number') {
      if (creationError === calendarsService.errors.FreeCalendarLimitReached) {
        return res.status(400).json({
          status: 400,
          error: 'Free Calendar Limit Reached',
        });
      }
    }

    res.status(201).json({
      status: 201,
      message: 'successful calendar creation',
      data: { calendar },
    });
  } catch (error) {
    next(error);
  }
}

const getAndDeleteValidationSchema = Joi.object({
  params: Joi.object({
    id: Joi.string()
      .required()
      .custom((value, helper) => {
        if (ObjectId.isValid(value)) {
          return true;
        }
        return helper.message('id must be a valid object id');
      }),
  }),
}).unknown(true);

async function get(req, res, next) {
  try {
    const { error } = getAndDeleteValidationSchema.validate(req);
    if (error) {
      return res.status(400).json({
        status: 400,
        error: error.message,
      });
    }

    const { user } = req;
    const { id } = req.params;
    const { calendar, error: getError } = await calendarsService.get({
      user,
      id,
    });

    if (typeof getError === 'number') {
      return handleError(getError, res);
    }

    return res.json({
      status: 200,
      message: 'successful calendar getting',
      data: { calendar },
    });
  } catch (error) {
    return next(error);
  }
}

const updateCalendarValidationSchema = Joi.object({
  params: Joi.object({
    id: idValidation,
  }),
  body: Joi.object({
    name: Joi.string(),
    joinType: Joi.string().valid('everyone', 'invited only'),
    description: Joi.string(),
  }),
}).unknown(true);

async function update(req, res, next) {
  try {
    const { error } = updateCalendarValidationSchema.validate(req);
    if (error) {
      return res.status(400).json({
        status: 400,
        error: error.message,
      });
    }

    const { user } = req;
    const { id } = req.params;
    const calendarData = req.body;

    const { calendar, error: updateError } = await calendarsService.update({
      user,
      id,
      calendarData,
    });

    if (updateError) return handleError(updateError, res);

    res.json({ status: 200, message: 'successful calendar updating', data: { calendar } });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const { error } = getAndDeleteValidationSchema.validate(req);
    if (error) {
      return res.status(400).json({
        status: 400,
        error: error.message,
      });
    }

    const { user } = req;
    const { id } = req.params;

    const { error: removeError } = await calendarsService.remove({ user, id });

    if (removeError) {
      return handleError(removeError, res);
    }

    return res.json({ status: 200, message: 'successful calendar deleting' });
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

async function addUser(req, res, next) {
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
    const { login: addingUserLogin } = req.body;

    const { calendar, addingUser, error: addUserError } = await calendarsService.addUser({
      user,
      id,
      addingUserLogin,
    });

    if (typeof addUserError === 'number') return handleError(addUserError, res);

    return res.json({
      status: 200,
      message: 'successful user adding',
      data: {
        calendar,
        addingUser,
      },
    });
  } catch (error) {
    return next(error);
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

    const { calendar, error: joinError } = await calendarsService.join({ user, token });

    if (typeof joinError === 'number') return handleError(joinError, res);

    return res.json({ status: 200, message: 'successful user joining', data: { calendar } });
  } catch (error) {
    return next(error);
  }
}

async function removeUser(req, res, next) {
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
    const { login: removingUserLogin } = req.body;

    const { error: removeUserError } = await calendarsService.removeUser({
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

// TODO: add another colors
const validColors = ['#D50000', '#E67C73', '#F4511E', '#F6BF26', '#33B679'];
const validEventTypes = ['arrangement', 'holiday', 'reminder', 'task'];
const validFrequencies = ['day', 'week', 'month', 'year'];

const addEventValidationSchema = Joi.object({
  params: {
    id: Joi.string()
      .required()
      .custom((value, helper) => {
        if (ObjectId.isValid(value)) {
          return true;
        }
        return helper.message('params.id must be a valid object id');
      }),
  },
  body: {
    name: Joi.string().required(true),
    executorLogin: Joi.string(),
    color: Joi.string()
      .valid(...validColors)
      .required(true),
    type: Joi.string()
      .valid(...validEventTypes)
      .required(true),
    startAt: Joi.date()
      .iso()
      .required(true),
    endAt: Joi.date().iso(),
    rrule: Joi.string(),
    duration: Joi.number().required(true),
    frequency: Joi.string().valid(...validFrequencies),
    description: Joi.string().default(''),
  },
}).unknown(true);

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function addEvent(req, res, next) {
  try {
    const { error } = addEventValidationSchema.validate(req);
    if (error) {
      return res.status(400).json({
        status: 400,
        error: error.message,
      });
    }

    const { user } = req;
    const { id } = req.params;
    const eventData = req.body;

    const { event, error: addEventError } = await calendarsService.addEvent({
      user,
      id,
      eventData,
    });

    if (typeof addEventError === 'number') return handleError(addEventError, res);

    // TODO: change to calendar id string
    event.calendar = undefined;

    res.status(201).json({
      status: 201,
      message: 'successful event creating',
      data: { event },
    });
  } catch (error) {
    return next(error);
  }
}

const getEventsValidationSchema = Joi.object({
  params: {
    id: idValidation,
  },
  query: Joi.object({
    from: Joi.date()
      .iso()
      .required(),
    to: Joi.date()
      .iso()
      .required(),
  }),
}).unknown(true);

async function getEvents(req, res, next) {
  try {
    const { error } = getEventsValidationSchema.validate(req);
    if (error) {
      return res.status(400).json({
        status: 400,
        error: error.message,
      });
    }

    const { user } = req;
    const { id } = req.params;
    const filters = req.query;

    const { events } = await calendarsService.getEvents({ user, id, filters });

    res.json({ status: 200, message: 'successful event filtering', data: { events } });
  } catch (error) {
    next(error);
  }
}

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

    const { calendar, togglingUser, error: toggleError } = await calendarsService.toggleAdmin({
      user,
      id,
      togglingUserLogin,
    });

    if (toggleError) return handleError(toggleError, res);

    res.json({
      status: 200,
      message: 'successful admin toggling',
      data: { calendar, togglingUser: { ...togglingUser, passwordHash: undefined } },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAll,
  create,
  get,
  remove,
  update,
  addUser,
  join,
  removeUser,
  addEvent,
  getEvents,
  toggleAdmin,
};

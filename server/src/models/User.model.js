const { Schema, model } = require('mongoose');
const Joi = require('joi');
const modelEquals = require('../utils/modelEquals.util');
const generateProfilePicture = require('../utils/profilePicture.util');

const emailValidationSchema = Joi.string().email();
/**
 *
 * @param {String} email
 */
function validateEmail(email) {
  const { error } = emailValidationSchema.validate(email);
  return !error;
}

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: 'email is required',
    validate: [validateEmail, 'email is invalid'],
  },
  login: { type: String, required: true, unique: true },
  name: { type: String, default: '' },
  passwordHash: { type: String },
  emailConfirm: { type: Boolean, default: false },
  profilePicture: { type: String, default: generateProfilePicture(Math.ceil(Math.random() * 100)) },
});

UserSchema.methods.equals = modelEquals;

const User = model('User', UserSchema);

module.exports = User;

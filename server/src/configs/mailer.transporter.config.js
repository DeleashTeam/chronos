const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const { pugEngine } = require('nodemailer-pug-engine');

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_NAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.use('compile', pugEngine({ templateDir: `${__dirname}/../public/views` }));

module.exports = transporter;

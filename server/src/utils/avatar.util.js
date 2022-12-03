const fs = require('fs');

const createLink = file => `${process.env.SERVER_LINK}/avatars/${file}`;

const deletePreviousFile = user => {
  const avatarLink = user.profilePicture;
  const file = avatarLink.slice(avatarLink.lastIndexOf('/'));
  fs.unlink(`${__dirname}/../public/avatars/${file}`, error => {
    if (error) {
      console.log(error);
    }
  });
};

module.exports = { createLink, deletePreviousFile };

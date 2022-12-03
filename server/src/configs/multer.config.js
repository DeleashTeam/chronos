const multer = require('multer');

const storageConfig = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, `${__dirname}/../public/avatars`);
  },
  filename: (request, file, callback) => {
    callback(null, `${request.user.id}-${Date.now()}.png`);
  },
});

const fileFilter = (request, file, callback) => {
  if (
    file.mimetype === 'image/png'
    || file.mimetype === 'image/jpg'
    || file.mimetype === 'image/jpeg'
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

module.exports = {
  storageConfig,
  fileFilter,
};

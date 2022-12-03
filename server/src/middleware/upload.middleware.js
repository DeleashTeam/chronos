const multer = require('multer');
const { fileFilter, storageConfig } = require('../configs/multer.config');

const upload = multer({
  storage: storageConfig,
  fileFilter,
});

module.exports = upload;

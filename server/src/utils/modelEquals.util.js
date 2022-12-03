function modelEquals(another) {
  return this._id.equals(another._id);
}

module.exports = modelEquals;

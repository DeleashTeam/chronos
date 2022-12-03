/**
 *
 * @param {import('../models').User[]} list
 * @param {import('../models').User} user
 */
function userInList(list, user) {
  const result = list.find(listItem => listItem.equals(user));
  return !!result;
}

module.exports = userInList;

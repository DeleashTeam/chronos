/**
 * @desc creates object from values under given params from template
 * @param {Object} template
 * @param  {...String} params
 * @returns data from database fitting given conditions in params
 */
function dbResponse(template, ...params) {
  const result = {};
  params.forEach(key => {
    result[key] = template[key];
  });
  return result;
}

module.exports = dbResponse;

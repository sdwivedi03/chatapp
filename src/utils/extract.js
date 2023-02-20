/**
 * Extracts properties listed into a new object
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
const extract = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.hasOwn(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

module.exports = extract;

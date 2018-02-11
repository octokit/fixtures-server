module.exports = mapValuesDeep

const _ = require('lodash')

function mapValuesDeep (v, callback) {
  if (_.isObject(v)) {
    return _.mapValues(v, v => mapValuesDeep(v, callback))
  }

  return callback(v)
}

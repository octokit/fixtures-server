export default mapValuesDeep;

import _ from "lodash";

function mapValuesDeep(v, callback) {
  if (Array.isArray(v)) {
    return _.map(v, (v) => mapValuesDeep(v, callback));
  }

  if (
    v !== null &&
    (typeof v === "object" || typeof v === "function") &&
    !Array.isArray(v)
  ) {
    return _.mapValues(v, (v) => mapValuesDeep(v, callback));
  }

  return callback(v);
}

export default function mapValuesDeep(v, callback) {
  if (Array.isArray(v)) {
    return v.map((val) => mapValuesDeep(val, callback));
  }

  if (v !== null && !Array.isArray(v) && typeof v === "object") {
    return Object.fromEntries(
      Object.entries(v).map(([key, val]) => [
        key,
        mapValuesDeep(val, callback),
      ]),
    );
  }

  return callback(v);
}

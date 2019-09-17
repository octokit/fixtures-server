const { test } = require("tap");
const mapValuesDeep = require("../../lib/map-values-deep");

test("mapValuesDeep leaves arrays intact (#5)", t => {
  const result = mapValuesDeep([1, 2], () => 0);
  t.ok(Array.isArray(result));

  t.end();
});

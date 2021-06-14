import { test } from "tap";
import mapValuesDeep from "../../lib/map-values-deep.js";

test("mapValuesDeep leaves arrays intact (#5)", (t) => {
  const result = mapValuesDeep([1, 2], () => 0);
  t.ok(Array.isArray(result));

  t.end();
});

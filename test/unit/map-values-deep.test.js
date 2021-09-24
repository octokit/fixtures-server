import { suite } from "uvu";
import * as assert from "uvu/assert";

import mapValuesDeep from "../../lib/map-values-deep.js";

const test = suite("mapValuesDeep");

test("mapValuesDeep leaves arrays intact (#5)", () => {
  const result = mapValuesDeep([1, 2], () => 0);
  assert.ok(Array.isArray(result));
});

test.run();

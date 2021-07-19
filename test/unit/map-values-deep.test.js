import mapValuesDeep from "../../lib/map-values-deep.js";

test("mapValuesDeep leaves arrays intact (#5)", () => {
  const result = mapValuesDeep([1, 2], () => 0);
  expect(Array.isArray(result)).toBeTruthy();
});

import _proxyquire from "proxyquire";

const proxyquire = _proxyquire.noCallThru();
import { test } from "tap";

test("globToFixture globbing JSON file != normalized-fixture.json", (t) => {
  const globToFixture = proxyquire("../../lib/glob-to-fixtures", {
    glob: {
      sync: () => ["/foo/bar.json"],
    },
    "/foo/bar.json": "baz",
  });
  const fixtures = globToFixture();
  t.deepEqual(fixtures, { bar: "baz" });

  t.end();
});

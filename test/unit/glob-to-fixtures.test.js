import { suite } from "uvu";
import * as assert from "uvu/assert";

import globToFixtures from "../../lib/glob-to-fixtures.js";

const test = suite("globToFixtures");

test("globToFixtures globbing JSON file != normalized-fixture.json", async () => {
  const fixtures = globToFixtures("test/fixtures/scenario/*");
  assert.equal(fixtures, {
    foo: {
      bar: "baz",
    },
  });
});

test.run();

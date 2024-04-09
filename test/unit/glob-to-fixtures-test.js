import t from "tap";

t.test(
  "globToFixture globbing JSON file != normalized-fixture.json",
  async (t) => {
    const globToFixture = await t.mockImport("../../lib/glob-to-fixtures.js", {
      glob: {
        glob: { sync: () => ["/foo/bar.json"] },
      },
      "node:fs": {
        readFileSync: () => JSON.stringify({ bar: "baz" }),
      },
    });
    const fixtures = (await import("../../lib/glob-to-fixtures.js"))();
    t.deepEqual(fixtures, { bar: "baz" });

    t.end();
  },
);

jest.mock("glob", () => ({
  sync: () => ["/foo/bar.json"],
}));

jest.mock("/foo/bar.json", () => "baz");

test("globToFixture globbing JSON file != normalized-fixture.json", async () => {
  const globToFixture = (await import("../../lib/glob-to-fixtures.js")).default;
  const fixtures = globToFixture();
  expect(fixtures).toEqual({ bar: "baz" });
});

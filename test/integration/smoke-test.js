import { test } from "tap";

test("loads @octokit/fixtures-server", async (t) => {
  await import("../../index.js");
  t.end();
});

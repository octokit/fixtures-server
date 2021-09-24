import { suite } from "uvu";

const test = suite("smoke");

test("loads @octokit/fixtures-server", async () => {
  await import("../../index.js").default;
});

test.run();

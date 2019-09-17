const { test } = require("tap");

test("loades @octokit/fixtures-server", t => {
  require("../..");
  t.end();
});

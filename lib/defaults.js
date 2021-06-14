import { dirname, resolve } from "path";
import globTofixtures from "./glob-to-fixtures.js";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const octokitFixturesPath = dirname(require.resolve("@octokit/fixtures"));
const DEFAULT_FIXTURES_GLOB = resolve(
  octokitFixturesPath,
  "scenarios/**/normalized-fixture.json"
);

export default {
  port: 3000,
  fixturesUrl: null,
  logLevel: "info",
  ttl: 60000,
  fixtures: globTofixtures(DEFAULT_FIXTURES_GLOB),
  fixturesGlob: DEFAULT_FIXTURES_GLOB.replace(process.cwd(), "."),
};

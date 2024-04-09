import globTofixtures from "./glob-to-fixtures.js";

const octokitFixturesPath = new URL(import.meta.resolve("@octokit/fixtures"));
const DEFAULT_FIXTURES_GLOB = new URL(
  "scenarios/**/normalized-fixture.json",
  octokitFixturesPath,
);

export default {
  port: 3000,
  fixturesUrl: null,
  logLevel: "info",
  ttl: 60000,
  fixtures: globTofixtures(DEFAULT_FIXTURES_GLOB.pathname),
  fixturesGlob: DEFAULT_FIXTURES_GLOB.pathname.replace(process.cwd(), "."),
};

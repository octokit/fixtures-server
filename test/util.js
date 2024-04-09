import fixtures from "@octokit/fixtures";

export function getScenarioFixture(name) {
  return fixtures.get(`api.github.com/${name}`);
}

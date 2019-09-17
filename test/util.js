module.exports = {
  getScenarioFixture
};

function getScenarioFixture(name) {
  return require(`@octokit/fixtures/scenarios/api.github.com/${name}/normalized-fixture.json`);
}

export { getScenarioFixture };

import { createRequire } from "module";
const require = createRequire(import.meta.url);

function getScenarioFixture(name) {
  return require(`@octokit/fixtures/scenarios/api.github.com/${name}/normalized-fixture.json`);
}

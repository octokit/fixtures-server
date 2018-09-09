const { dirname, resolve } = require('path')
const globTofixtures = require('./glob-to-fixtures')

const octokitFixturesPath = dirname(require.resolve('@octokit/fixtures'))
const DEFAULT_FIXTURES_GLOB = resolve(octokitFixturesPath, 'scenarios/**/normalized-fixture.json')

module.exports = {
  port: 3000,
  fixturesUrl: null,
  logLevel: 'info',
  ttl: 60000,
  fixtures: globTofixtures(DEFAULT_FIXTURES_GLOB),
  fixturesGlob: DEFAULT_FIXTURES_GLOB.replace(process.cwd(), '.')
}

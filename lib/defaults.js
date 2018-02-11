const {resolve} = require('path')
const resolvePackage = require('resolve-pkg')
const DEFAULT_FIXTURES_GLOB = resolve(resolvePackage('@octokit/fixtures'), 'scenarios/**/normalized-fixture.json')
const globTofixtures = require('./glob-to-fixtures')

module.exports = {
  port: 3000,
  fixturesUrl: null,
  logLevel: 'info',
  ttl: 60000,
  fixtures: globTofixtures(DEFAULT_FIXTURES_GLOB),
  fixturesGlob: DEFAULT_FIXTURES_GLOB.replace(process.cwd(), '.')
}

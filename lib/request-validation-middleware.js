module.exports = requireFixturesId

const urlParse = require('url').parse

function requireFixturesId (state, req, res, next) {
  if (!req.headers['accept']) {
    return res.status(400).json({
      error: 'Accept header required'
    })
  }

  const fixturesId = req.headers['x-fixtures-id']
  if (!fixturesId) {
    return res.status(400).json({
      error: 'X-Fixtures-Id header required'
    })
  }

  const mock = state.cachimo.get(fixturesId)

  if (!mock) {
    return res.status(404).json({
      error: `Fixture "${fixturesId}" not found`
    })
  }

  const [nextFixture] = mock.pending()

  const nextFixtureMethod = nextFixture.split(' ')[0].toUpperCase()
  const nextFixturePath = urlParse(nextFixture.substr(nextFixtureMethod.length + 1)).pathname

  if (req.method !== nextFixtureMethod || req.path !== nextFixturePath) {
    return res.status(404).json({
      error: `${req.method} ${req.path} does not match next fixture: ${nextFixtureMethod} ${nextFixturePath}`
    })
  }

  next()
}

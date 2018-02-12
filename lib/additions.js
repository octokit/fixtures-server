module.exports = fixtureAdditions

const mapValuesDeep = require('./map-values-deep')

function fixtureAdditions (state, {id, fixture}) {
  fixture.reqheaders['x-fixtures-id'] = id
  fixture = mapValuesDeep(fixture, value => {
    if (typeof value !== 'string') {
      return value
    }

    // e.g. https://api.github.com/user -> http://localhost/api.github.com/user
    return value.replace(/https?:\/\/([^/]+)\//, `${state.fixturesUrl}/$1/`)
  })

  fixture.headers['content-length'] = String(calculateBodyLength(fixture.response))
  return fixture
}

function calculateBodyLength (body) {
  if (typeof body !== 'string') {
    body = JSON.stringify(body)
  }

  return Buffer.byteLength(body, 'utf8')
}

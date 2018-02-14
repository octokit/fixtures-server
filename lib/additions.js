module.exports = fixtureAdditions

const parseUrl = require('url').parse

const mapValuesDeep = require('./map-values-deep')

function fixtureAdditions (state, {id, fixture}) {
  fixture = mapValuesDeep(fixture, value => {
    if (typeof value !== 'string') {
      return value
    }

    // e.g. https://api.github.com/user -> http://localhost/api.github.com/fixturesid123/user
    return value.replace(/https?:\/\/([^/]+)\//, `${state.fixturesUrl}/$1/${id}/`)
  })

  fixture.headers['content-length'] = String(calculateBodyLength(fixture.response))

  // We make the fixtures id part of the hostname to avoid conflicts with other
  // mocks loaded with nock as they are global for the same process. Looking up
  // fixtures by unique hostname is more efficient, too.
  const {protocol, hostname, port} = parseUrl(fixture.scope)
  const newHostame = `fixtures-${id}.${hostname}`
  fixture.scope = `${protocol}//${newHostame}:${port}`
  fixture.reqheaders.host = newHostame

  return fixture
}

function calculateBodyLength (body) {
  if (typeof body !== 'string') {
    body = JSON.stringify(body)
  }

  return Buffer.byteLength(body, 'utf8')
}

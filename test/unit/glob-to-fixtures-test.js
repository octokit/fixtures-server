const proxyquire = require('proxyquire').noCallThru()
const { test } = require('tap')

test('globToFixture globbing JSON file != normalized-fixture.json', t => {
  const globToFixture = proxyquire('../../lib/glob-to-fixtures', {
    glob: {
      sync: () => ['/foo/bar.json']
    },
    '/foo/bar.json': 'baz'
  })
  const fixtures = globToFixture()
  t.deepEqual(fixtures, { bar: 'baz' })

  t.end()
})

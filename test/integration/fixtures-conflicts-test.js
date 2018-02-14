const express = require('express')
const supertest = require('supertest')
const {test} = require('tap')

const {getScenarioFixture} = require('../util')
const middleware = require('../..')

test('conflicts test (#8)', async t => {
  const app = express()
  app.use(middleware({
    logLevel: 'error',
    ttl: 1000,
    fixtures: {
      'release-assets': getScenarioFixture('release-assets')
    }
  }))

  const agent = supertest(app)

  // intentionally load same fixture twice
  await agent
    .post('/fixtures')
    .send({scenario: 'release-assets'})
  const {body: {id: fixtureId}} = await agent
    .post('/fixtures')
    .send({scenario: 'release-assets'})
  const {body: {upload_url}} = await agent
    .get(`/api.github.com/${fixtureId}/repos/octokit-fixture-org/release-assets/releases/tags/v1.0.0`)
    .set({
      accept: 'application/vnd.github.v3+json',
      authorization: 'token 0000000000000000000000000000000000000001'
    })

  t.is(upload_url, `http://localhost:3000/uploads.github.com/${fixtureId}/repos/octokit-fixture-org/release-assets/releases/1000/assets{?name,label}`)

  const result = await agent
    .post(`/uploads.github.com/${fixtureId}/repos/octokit-fixture-org/release-assets/releases/1000/assets`)
    .query({
      name: 'test-upload.txt',
      label: 'test'
    })
    .send('Hello, world!\n')
    .set({
      accept: 'application/vnd.github.v3+json',
      authorization: 'token 0000000000000000000000000000000000000001',
      'content-type': 'text/plain',
      'content-length': 14
    })
    .catch(error => console.log(error.stack))

  t.is(result.body.name, 'test-upload.txt')

  t.end()
})

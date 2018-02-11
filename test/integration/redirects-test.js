const express = require('express')
const supertest = require('supertest')
const {test} = require('tap')

const {getScenarioFixture} = require('../util')
const middleware = require('../..')

test('get repository success (redirect URL test)', async t => {
  const app = express()
  app.use(middleware({
    logLevel: 'error',
    ttl: 1000,
    fixtures: {
      'rename-repository': getScenarioFixture('rename-repository')
    }
  }))

  const agent = supertest(app)
  const fixtureResponse = await agent
    .post('/fixtures')
    .send({scenario: 'rename-repository'})
    .catch(t.error)

  t.is(fixtureResponse.status, 201, fixtureResponse.body.error)
  const {id} = fixtureResponse.body

  const renameResponse = await agent
    .patch('/api.github.com/repos/octokit-fixture-org/rename-repository')
    .set({
      accept: 'application/vnd.github.v3+json',
      authorization: 'token 0000000000000000000000000000000000000001',
      'content-type': 'application/json; charset=utf-8',
      'x-fixtures-id': id
    })
    .send({
      name: 'rename-repository-newname'
    })
    .catch(t.error)

  t.is(renameResponse.status, 200, renameResponse.body.detail || renameResponse.body.error)

  const getResponse = await agent
    .get('/api.github.com/repos/octokit-fixture-org/rename-repository')
    .set({
      accept: 'application/vnd.github.v3+json',
      authorization: 'token 0000000000000000000000000000000000000001',
      'x-fixtures-id': id
    })
    .catch(t.error)

  t.is(getResponse.status, 301, getResponse.body.detail || getResponse.body.error)
  t.is(getResponse.headers.location, 'http://localhost:3000/api.github.com/repositories/1000', 'redirect URL is prefixed correctly')

  t.end()
})

test('get repository success (redirect with custom URL test)', async t => {
  const app = express()
  app.use(middleware({
    logLevel: 'error',
    ttl: 1000,
    fixtures: {
      'rename-repository': getScenarioFixture('rename-repository')
    },
    fixturesUrl: 'https://deployment123.my-mock-server.com'
  }))

  const agent = supertest(app)
  const fixtureResponse = await agent
    .post('/fixtures')
    .send({scenario: 'rename-repository'})
    .catch(t.error)

  t.is(fixtureResponse.status, 201, fixtureResponse.body.error)
  const {id} = fixtureResponse.body

  const renameResponse = await agent
    .patch('/api.github.com/repos/octokit-fixture-org/rename-repository')
    .set({
      accept: 'application/vnd.github.v3+json',
      authorization: 'token 0000000000000000000000000000000000000001',
      'content-type': 'application/json; charset=utf-8',
      'x-fixtures-id': id
    })
    .send({
      name: 'rename-repository-newname'
    })
    .catch(t.error)

  t.is(renameResponse.status, 200, renameResponse.body.detail || renameResponse.body.error)

  const getResponse = await agent
    .get('/api.github.com/repos/octokit-fixture-org/rename-repository')
    .set({
      accept: 'application/vnd.github.v3+json',
      authorization: 'token 0000000000000000000000000000000000000001',
      'x-fixtures-id': id
    })
    .catch(t.error)

  t.is(getResponse.status, 301, getResponse.body.detail || getResponse.body.error)
  t.is(getResponse.headers.location, 'https://deployment123.my-mock-server.com/api.github.com/repositories/1000', 'redirect URL is prefixed correctly')

  t.end()
})

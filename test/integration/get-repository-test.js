const express = require('express')
const supertest = require('supertest')
const {test} = require('tap')

const {getScenarioFixture} = require('../util')
const middleware = require('../..')

test('get repository success', async t => {
  const app = express()
  app.use(middleware({
    logLevel: 'error',
    ttl: 1000,
    fixtures: {
      'get-repository': getScenarioFixture('get-repository')
    }
  }))

  const agent = supertest(app)
  const {body: {id}} = await agent
    .post('/fixtures')
    .send({scenario: 'get-repository'})
  const {body} = await agent
    .get('/api.github.com/repos/octokit-fixture-org/hello-world')
    .set({
      accept: 'application/vnd.github.v3+json',
      'x-fixtures-id': id
    })

  t.is(body.name, 'hello-world')
  t.end()
})

test('get repository without X-Fixtures-Id header', async t => {
  const app = express()
  app.use(middleware({
    logLevel: 'error',
    ttl: 1000,
    fixtures: {
      'get-repository': getScenarioFixture('get-repository')
    }
  }))

  const agent = supertest(app)
  const {status, body} = await agent
    .get('/api.github.com/repos/octokit-fixture-org/hello-world')
    .set({
      accept: 'application/vnd.github.v3+json'
    })

  t.is(status, 400)
  t.is(body.error, 'X-Fixtures-Id header required')
  t.end()
})

test('get repository without Accept header', async t => {
  const app = express()
  app.use(middleware({
    logLevel: 'error',
    ttl: 1000,
    fixtures: {
      'get-repository': getScenarioFixture('get-repository')
    }
  }))

  const agent = supertest(app)
  const {status, body} = await agent
    .get('/api.github.com/repos/octokit-fixture-org/hello-world')
    .set({
      'x-fixtures-id': 123
    })

  t.is(status, 400)
  t.is(body.error, 'Accept header required')
  t.end()
})

test('get repository with invalid X-Fixtures-Id header', async t => {
  const app = express()
  app.use(middleware({
    logLevel: 'error',
    ttl: 1000,
    fixtures: {
      'get-repository': getScenarioFixture('get-repository')
    }
  }))

  const agent = supertest(app)
  const {status, body} = await agent
    .get('/api.github.com/repos/octokit-fixture-org/hello-world')
    .set({
      accept: 'application/vnd.github.v3+json',
      'x-fixtures-id': 123
    })

  t.is(status, 404)
  t.is(body.error, 'Fixture "123" not found')
  t.end()
})

test('get repository with incorrect path', async t => {
  const app = express()
  app.use(middleware({
    logLevel: 'error',
    ttl: 1000,
    fixtures: {
      'get-repository': getScenarioFixture('get-repository')
    }
  }))

  const agent = supertest(app)
  const {body: {id}} = await agent
    .post('/fixtures')
    .send({scenario: 'get-repository'})

  const {status, body} = await agent
    .get('/api.github.com/foo')
    .set({
      accept: 'application/vnd.github.v3+json',
      'x-fixtures-id': id
    })

  t.is(status, 404)
  t.is(body.error, 'GET /foo does not match next fixture: GET /repos/octokit-fixture-org/hello-world')
  t.end()
})

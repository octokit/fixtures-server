const { URL } = require('url')

const express = require('express')
const supertest = require('supertest')
const { test } = require('tap')

const middleware = require('../..')

test('request error: no matching fixture found', async t => {
  const app = express()
  app.use(middleware({
    logLevel: 'silent',
    ttl: 1000
  }))

  const agent = supertest(app)
  const { body: { url } } = await agent
    .post('/fixtures')
    .send({ scenario: 'create-file' })

  const { status, body } = await agent
    .put(`${new URL(url).pathname}/repos/octokit-fixture-org/create-file/contents/test.txt`)
    .set({
      accept: 'application/vnd.github.v3+json',
      Authorization: 'token 0000000000000000000000000000000000000001'
    })
    .send({
      message: 'wrong message',
      content: 'wrong content'
    })
    .catch((error) => error.response)

  t.is(status, 404)
  t.is(body.error, 'Nock: No match for request')

  t.end()
})

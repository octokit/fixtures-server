const express = require('express')
const supertest = require('supertest')
const {test} = require('tap')

const {getScenarioFixture} = require('../util')
const middleware = require('../..')

// Two GET /api.github.com/repos/octokit-fixture-org/add-and-remove-repository-collaborator/collaborators
// requests return different results based on order, see gr2m/octokit-rest-browser-experimental#4
test('add-and-remove-repository-collaborator (same request/different response)', async t => {
  const app = express()
  app.use(middleware({
    logLevel: 'error',
    ttl: 1000,
    fixtures: {
      'add-and-remove-repository-collaborator': getScenarioFixture('add-and-remove-repository-collaborator')
    }
  }))

  const agent = supertest(app)
  const fixtureResponse = await agent
    .post('/fixtures')
    .send({scenario: 'add-and-remove-repository-collaborator'})
    .catch(t.error)

  t.is(fixtureResponse.status, 201, fixtureResponse.body.error)
  const {id} = fixtureResponse.body

  // https://developer.github.com/v3/repos/collaborators/#add-user-as-a-collaborator
  const addCollaboratorResponse = await agent
    .put('/api.github.com/repos/octokit-fixture-org/add-and-remove-repository-collaborator/collaborators/octokit-fixture-user-b')
    .set({
      accept: 'application/vnd.github.v3+json',
      authorization: 'token 0000000000000000000000000000000000000001',
      'x-fixtures-id': id
    })
    .catch(t.error)

  t.is(addCollaboratorResponse.status, 201, addCollaboratorResponse.body.detail || addCollaboratorResponse.body.error)

  // https://developer.github.com/v3/repos/invitations/
  const getInvitationsResponse = await agent
    .get('/api.github.com/repos/octokit-fixture-org/add-and-remove-repository-collaborator/invitations')
    .set({
      accept: 'application/vnd.github.v3+json',
      authorization: 'token 0000000000000000000000000000000000000001',
      'x-fixtures-id': id
    })
    .catch(t.error)

  t.is(getInvitationsResponse.status, 200, getInvitationsResponse.body.detail || getInvitationsResponse.body.error)
  t.is(getInvitationsResponse.body[0].id, 1000)

  // https://developer.github.com/v3/repos/invitations/#accept-a-repository-invitation
  const acceptInvitationResponse = await agent
    .patch('/api.github.com/user/repository_invitations/1000')
    .set({
      accept: 'application/vnd.github.v3+json',
      authorization: 'token 0000000000000000000000000000000000000002',
      'x-fixtures-id': id
    })
    .catch(t.error)

  t.is(acceptInvitationResponse.status, 204, acceptInvitationResponse.body.detail || acceptInvitationResponse.body.error)

  // https://developer.github.com/v3/repos/collaborators/#list-collaborators
  const listCollaborators1Response = await agent
    .get('/api.github.com/repos/octokit-fixture-org/add-and-remove-repository-collaborator/collaborators')
    .set({
      accept: 'application/vnd.github.v3+json',
      authorization: 'token 0000000000000000000000000000000000000001',
      'x-fixtures-id': id
    })
    .catch(t.error)

  t.is(listCollaborators1Response.status, 200, listCollaborators1Response.body.detail || listCollaborators1Response.body.error)
  // listCollaborators1Response.body should be an array, but instead is an {'1': {}, '2': {}} object ¯\_(ツ)_/¯
  t.is(listCollaborators1Response.body[1].login, 'octokit-fixture-user-b')

  // https://developer.github.com/v3/repos/collaborators/#remove-user-as-a-collaborator
  const removeCollaboratorResponse = await agent
    .delete('/api.github.com/repos/octokit-fixture-org/add-and-remove-repository-collaborator/collaborators/octokit-fixture-user-b')
    .set({
      accept: 'application/vnd.github.v3+json',
      authorization: 'token 0000000000000000000000000000000000000001',
      'x-fixtures-id': id
    })
    .catch(t.error)

  t.is(removeCollaboratorResponse.status, 204, removeCollaboratorResponse.body.detail || removeCollaboratorResponse.body.error)

  // https://developer.github.com/v3/repos/collaborators/#list-collaborators
  const listCollaborators2Response = await agent
    .get('/api.github.com/repos/octokit-fixture-org/add-and-remove-repository-collaborator/collaborators')
    .set({
      accept: 'application/vnd.github.v3+json',
      authorization: 'token 0000000000000000000000000000000000000001',
      'x-fixtures-id': id
    })
    .catch(t.error)

  t.is(listCollaborators2Response.status, 200, listCollaborators2Response.body.detail || listCollaborators2Response.body.error)
  t.is(listCollaborators2Response.body[1], undefined)

  t.end()
})

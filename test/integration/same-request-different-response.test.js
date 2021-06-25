import express from "express";
import supertest from "supertest";

import { getScenarioFixture } from "../util.js";
import middleware from "../../index.js";

// Two GET /api.github.com/repos/octokit-fixture-org/add-and-remove-repository-collaborator/collaborators
// requests return different results based on order, see gr2m/octokit-rest-browser-experimental#4
test("add-and-remove-repository-collaborator (same request/different response)", async (done) => {
  const app = express();
  app.use(
    middleware({
      logLevel: "error",
      ttl: 1000,
      fixtures: {
        "add-and-remove-repository-collaborator": getScenarioFixture(
          "add-and-remove-repository-collaborator"
        ),
      },
    })
  );

  const agent = supertest(app);
  const fixtureResponse = await agent
    .post("/fixtures")
    .send({ scenario: "add-and-remove-repository-collaborator" })
    .catch(done.fail);

  expect(fixtureResponse.status).toBe(201);
  const { id } = fixtureResponse.body;

  // https://developer.github.com/v3/repos/collaborators/#add-user-as-a-collaborator
  const addCollaboratorResponse = await agent
    .put(
      `/api.github.com/${id}/repos/octokit-fixture-org/add-and-remove-repository-collaborator/collaborators/octokit-fixture-user-b`
    )
    .set({
      accept: "application/vnd.github.v3+json",
      authorization: "token 0000000000000000000000000000000000000001",
    })
    .catch(done.fail);

  expect(addCollaboratorResponse.status).toBe(201);

  // https://developer.github.com/v3/repos/invitations/
  const getInvitationsResponse = await agent
    .get(
      `/api.github.com/${id}/repos/octokit-fixture-org/add-and-remove-repository-collaborator/invitations`
    )
    .set({
      accept: "application/vnd.github.v3+json",
      authorization: "token 0000000000000000000000000000000000000001",
    })
    .catch(done.fail());

  expect(getInvitationsResponse.status).toBe(200);
  expect(getInvitationsResponse.body[0].id).toBe(1000);

  // https://developer.github.com/v3/repos/invitations/#accept-a-repository-invitation
  const acceptInvitationResponse = await agent
    .patch(`/api.github.com/${id}/user/repository_invitations/1000`)
    .set({
      accept: "application/vnd.github.v3+json",
      authorization: "token 0000000000000000000000000000000000000002",
    })
    .catch(done.fail);

  expect(acceptInvitationResponse.status).toBe(204);

  // https://developer.github.com/v3/repos/collaborators/#list-collaborators
  const listCollaborators1Response = await agent
    .get(
      `/api.github.com/${id}/repos/octokit-fixture-org/add-and-remove-repository-collaborator/collaborators`
    )
    .set({
      accept: "application/vnd.github.v3+json",
      authorization: "token 0000000000000000000000000000000000000001",
    })
    .catch(done.fail);

  expect(listCollaborators1Response.status).toBe(200);
  // listCollaborators1Response.body should be an array, but instead is an {'1': {}, '2': {}} object ¯\_(ツ)_/¯
  expect(listCollaborators1Response.body[1].login).toBe(
    "octokit-fixture-user-b"
  );

  // https://developer.github.com/v3/repos/collaborators/#remove-user-as-a-collaborator
  const removeCollaboratorResponse = await agent
    .delete(
      `/api.github.com/${id}/repos/octokit-fixture-org/add-and-remove-repository-collaborator/collaborators/octokit-fixture-user-b`
    )
    .set({
      accept: "application/vnd.github.v3+json",
      authorization: "token 0000000000000000000000000000000000000001",
    })
    .catch(done.fail);

  expect(removeCollaboratorResponse.status).toBe(204);

  // https://developer.github.com/v3/repos/collaborators/#list-collaborators
  const listCollaborators2Response = await agent
    .get(
      `/api.github.com/${id}/repos/octokit-fixture-org/add-and-remove-repository-collaborator/collaborators`
    )
    .set({
      accept: "application/vnd.github.v3+json",
      authorization: "token 0000000000000000000000000000000000000001",
    })
    .catch(done.fail);

  expect(listCollaborators2Response.status).toBe(200);
  expect(listCollaborators2Response.body[1]).toBe(undefined);
});

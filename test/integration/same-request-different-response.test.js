import express from "express";
import supertest from "supertest";
import { suite } from "uvu";
import * as assert from "uvu/assert";

import { getScenarioFixture } from "../util.js";
import middleware from "../../index.js";

const test = suite("same request, different response");

// Two GET /api.github.com/repos/octokit-fixture-org/add-and-remove-repository-collaborator/collaborators
// requests return different results based on order, see gr2m/octokit-rest-browser-experimental#4
test("add-and-remove-repository-collaborator (same request/different response)", async () => {
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
    .send({ scenario: "add-and-remove-repository-collaborator" });

  assert.equal(fixtureResponse.status, 201);
  const { id } = fixtureResponse.body;

  // https://developer.github.com/v3/repos/collaborators/#add-user-as-a-collaborator
  const addCollaboratorResponse = await agent
    .put(
      `/api.github.com/${id}/repos/octokit-fixture-org/add-and-remove-repository-collaborator/collaborators/octokit-fixture-user-b`
    )
    .set({
      accept: "application/vnd.github.v3+json",
      authorization: "token 0000000000000000000000000000000000000001",
    });

  assert.equal(addCollaboratorResponse.status, 201);

  // https://developer.github.com/v3/repos/invitations/
  const getInvitationsResponse = await agent
    .get(
      `/api.github.com/${id}/repos/octokit-fixture-org/add-and-remove-repository-collaborator/invitations`
    )
    .set({
      accept: "application/vnd.github.v3+json",
      authorization: "token 0000000000000000000000000000000000000001",
    });

  assert.equal(getInvitationsResponse.status, 200);
  assert.equal(getInvitationsResponse.body[0].id, 1000);

  // https://developer.github.com/v3/repos/invitations/#accept-a-repository-invitation
  const acceptInvitationResponse = await agent
    .patch(`/api.github.com/${id}/user/repository_invitations/1000`)
    .set({
      accept: "application/vnd.github.v3+json",
      authorization: "token 0000000000000000000000000000000000000002",
    });

  assert.equal(acceptInvitationResponse.status, 204);

  // https://developer.github.com/v3/repos/collaborators/#list-collaborators
  const listCollaborators1Response = await agent
    .get(
      `/api.github.com/${id}/repos/octokit-fixture-org/add-and-remove-repository-collaborator/collaborators`
    )
    .set({
      accept: "application/vnd.github.v3+json",
      authorization: "token 0000000000000000000000000000000000000001",
    });

  assert.equal(listCollaborators1Response.status, 200);
  // listCollaborators1Response.body should be an array, but instead is an {'1': {}, '2': {}} object ¯\_(ツ)_/¯
  assert.equal(
    listCollaborators1Response.body[1].login,
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
    });

  assert.equal(removeCollaboratorResponse.status, 204);

  // https://developer.github.com/v3/repos/collaborators/#list-collaborators
  const listCollaborators2Response = await agent
    .get(
      `/api.github.com/${id}/repos/octokit-fixture-org/add-and-remove-repository-collaborator/collaborators`
    )
    .set({
      accept: "application/vnd.github.v3+json",
      authorization: "token 0000000000000000000000000000000000000001",
    });

  assert.equal(listCollaborators2Response.status, 200);
  assert.equal(listCollaborators2Response.body[1], undefined);
});

test.run();

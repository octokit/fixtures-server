import { URL } from "url";

import express from "express";
import supertest from "supertest";
import { suite } from "uvu";
import * as assert from "uvu/assert";

import { getScenarioFixture } from "../util.js";
import middleware from "../../index.js";

const test = suite("redirects");

test("get repository redirect (gr2m/octokit-rest-browser-experimental#6)", async () => {
  const app = express();
  app.use(
    middleware({
      logLevel: "error",
      ttl: 1000,
      fixtures: {
        "rename-repository": getScenarioFixture("rename-repository"),
      },
    })
  );

  const agent = supertest(app);
  const fixtureResponse = await agent
    .post("/fixtures")
    .send({ scenario: "rename-repository" });

  assert.equal(fixtureResponse.status, 201);
  const path = new URL(fixtureResponse.body.url).pathname;

  const renameResponse = await agent
    .patch(`${path}/repos/octokit-fixture-org/rename-repository`)
    .set({
      accept: "application/vnd.github.v3+json",
      authorization: "token 0000000000000000000000000000000000000001",
      "content-type": "application/json; charset=utf-8",
    })
    .send({
      name: "rename-repository-newname",
    });

  assert.equal(renameResponse.status, 200);

  const getResponse = await agent
    .get(`${path}/repos/octokit-fixture-org/rename-repository`)
    .set({
      accept: "application/vnd.github.v3+json",
      authorization: "token 0000000000000000000000000000000000000001",
    })
    .catch((error) => error.response);

  assert.equal(getResponse.status, 301);
  assert.equal(
    getResponse.headers.location,
    `http://localhost:3000${path}/repositories/1000`
  );
});

test("get repository success (redirect with custom URL test)", async () => {
  const app = express();
  app.use(
    middleware({
      logLevel: "error",
      ttl: 1000,
      fixtures: {
        "rename-repository": getScenarioFixture("rename-repository"),
      },
      fixturesUrl: "https://deployment123.my-mock-server.com",
    })
  );

  const agent = supertest(app);
  const fixtureResponse = await agent
    .post("/fixtures")
    .send({ scenario: "rename-repository" });

  assert.equal(fixtureResponse.status, 201);
  const path = new URL(fixtureResponse.body.url).pathname;

  const renameResponse = await agent
    .patch(`${path}/repos/octokit-fixture-org/rename-repository`)
    .set({
      accept: "application/vnd.github.v3+json",
      authorization: "token 0000000000000000000000000000000000000001",
      "content-type": "application/json; charset=utf-8",
    })
    .send({
      name: "rename-repository-newname",
    });

  assert.equal(renameResponse.status, 200);

  const getResponse = await agent
    .get(`${path}/repos/octokit-fixture-org/rename-repository`)
    .set({
      accept: "application/vnd.github.v3+json",
      authorization: "token 0000000000000000000000000000000000000001",
    })
    .catch((error) => error.response);

  assert.equal(getResponse.status, 301);
  assert.equal(
    getResponse.headers.location,
    `https://deployment123.my-mock-server.com${path}/repositories/1000`
  );
});

test.run();

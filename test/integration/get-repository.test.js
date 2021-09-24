import { URL } from "url";

import express from "express";
import supertest from "supertest";
import { suite } from "uvu";
import * as assert from "uvu/assert";

import { getScenarioFixture } from "../util.js";
import middleware from "../../index.js";

const test = suite("get repository");

test("get repository success", async () => {
  const app = express();
  app.use(
    middleware({
      logLevel: "error",
      ttl: 1000,
      fixtures: {
        "get-repository": getScenarioFixture("get-repository"),
      },
    })
  );

  const agent = supertest(app);
  const {
    body: { url },
  } = await agent.post("/fixtures").send({ scenario: "get-repository" });

  const { body } = await agent
    .get(`${new URL(url).pathname}/repos/octokit-fixture-org/hello-world`)
    .set({
      accept: "application/vnd.github.v3+json",
      authorization: "token 0000000000000000000000000000000000000001",
    });

  assert.equal(body.name, "hello-world");
});

test("get repository without Accept header", async () => {
  const app = express();
  app.use(
    middleware({
      logLevel: "error",
      ttl: 1000,
      fixtures: {
        "get-repository": getScenarioFixture("get-repository"),
      },
    })
  );

  const agent = supertest(app);
  const { status, body } = await agent
    .get("/api.github.com/fixturesid123/repos/octokit-fixture-org/hello-world")
    .catch((error) => error.response);

  assert.equal(status, 400);
  assert.equal(body.error, "Accept header required");
});

test("get repository with invalid X-Fixtures-Id header", async () => {
  const app = express();
  app.use(
    middleware({
      logLevel: "error",
      ttl: 1000,
      fixtures: {
        "get-repository": getScenarioFixture("get-repository"),
      },
    })
  );

  const agent = supertest(app);
  const { status, body } = await agent
    .get("/api.github.com/fixturesid123/repos/octokit-fixture-org/hello-world")
    .set({
      accept: "application/vnd.github.v3+json",
      authorization: "token 0000000000000000000000000000000000000001",
    })
    .catch((error) => error.response);

  assert.equal(status, 404);
  assert.equal(body.error, 'Fixture "fixturesid123" not found');
});

test("get repository with incorrect path", async () => {
  const app = express();
  app.use(
    middleware({
      logLevel: "error",
      ttl: 1000,
      fixtures: {
        "get-repository": getScenarioFixture("get-repository"),
      },
    })
  );

  const agent = supertest(app);
  const {
    body: { url },
  } = await agent.post("/fixtures").send({ scenario: "get-repository" });

  const { status, body } = await agent
    .get(`${new URL(url).pathname}/foo`)
    .set({
      accept: "application/vnd.github.v3+json",
      authorization: "token 0000000000000000000000000000000000000001",
    })
    .catch((error) => error.response);

  assert.equal(status, 404);
  assert.equal(
    body.error,
    "GET /foo does not match next fixture: GET /repos/octokit-fixture-org/hello-world"
  );
});

test.run();

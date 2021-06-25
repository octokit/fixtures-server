import { URL } from "url";

import express from "express";
import supertest from "supertest";

import { getScenarioFixture } from "../util.js";
import middleware from "../../index.js";

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

  expect(body.name).toBe("hello-world");
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

  expect(status).toBe(400);
  expect(body.error).toBe("Accept header required");
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

  expect(status).toBe(404);
  expect(body.error).toBe('Fixture "fixturesid123" not found');
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

  expect(status).toBe(404);
  expect(body.error).toBe(
    "GET /foo does not match next fixture: GET /repos/octokit-fixture-org/hello-world"
  );
});

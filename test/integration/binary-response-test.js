const { URL } = require("url");

const express = require("express");
const supertest = require("supertest");
const { test } = require("tap");

const { getScenarioFixture } = require("../util");
const middleware = require("../..");

test("binary response (octokit/rest.js#743)", async (t) => {
  const app = express();
  app.use(
    middleware({
      logLevel: "error",
      ttl: 1000,
      fixtures: {
        "get-archive": getScenarioFixture("get-archive"),
      },
    })
  );

  const agent = supertest(app);
  const {
    body: { id: fixtureId },
  } = await agent.post("/fixtures").send({ scenario: "get-archive" });

  const getArchiveResponse = await agent
    .get(
      `/api.github.com/${fixtureId}/repos/octokit-fixture-org/get-archive/tarball/main`
    )
    .set({
      accept: "application/vnd.github.v3+json",
      authorization: "token 0000000000000000000000000000000000000001",
    })
    .catch((error) => error.response);

  t.is(getArchiveResponse.status, 302);
  t.is(
    getArchiveResponse.headers.location,
    `http://localhost:3000/codeload.github.com/${fixtureId}/octokit-fixture-org/get-archive/legacy.tar.gz/main`
  );

  const { pathname } = new URL(getArchiveResponse.headers.location);

  const { status } = await agent.get(pathname).set({
    accept: "application/vnd.github.v3+json",
    authorization: "token 0000000000000000000000000000000000000001",
  });

  t.is(status, 200);

  t.end();
});

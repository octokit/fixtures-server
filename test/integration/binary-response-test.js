import express from "express";
import supertest from "supertest";
import { test } from "tap";

import { getScenarioFixture } from "../util.js";
import middleware from "../../index.js";

test("binary response (octokit/rest.js#743)", async (t) => {
  const app = express();
  app.use(
    middleware({
      logLevel: "error",
      ttl: 1000,
      fixtures: {
        "get-archive": getScenarioFixture("get-archive"),
      },
    }),
  );

  const agent = supertest(app);
  const {
    body: { id: fixtureId },
  } = await agent.post("/fixtures").send({ scenario: "get-archive" });

  const getArchiveResponse = await agent
    .get(
      `/api.github.com/${fixtureId}/repos/octokit-fixture-org/get-archive/tarball/main`,
    )
    .set({
      accept: "application/vnd.github.v3+json",
      authorization: "token 0000000000000000000000000000000000000001",
    })
    .catch((error) => error.response);

  t.equal(getArchiveResponse.status, 302);
  t.equal(
    getArchiveResponse.headers.location,
    `http://localhost:3000/codeload.github.com/${fixtureId}/octokit-fixture-org/get-archive/legacy.tar.gz/refs/heads/main`,
  );

  const { pathname } = new URL(getArchiveResponse.headers.location);

  const { status } = await agent.get(pathname).set({
    accept: "application/vnd.github.v3+json",
    authorization: "token 0000000000000000000000000000000000000001",
  });

  t.equal(status, 200);

  t.end();
});

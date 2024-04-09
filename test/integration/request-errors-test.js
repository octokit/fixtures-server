import express from "express";
import supertest from "supertest";
import { test } from "tap";

import middleware from "../../index.js";

test("request error: no matching fixture found", async (t) => {
  const app = express();
  app.use(
    middleware({
      logLevel: "silent",
      ttl: 1000,
    }),
  );

  const agent = supertest(app);
  const {
    body: { url },
  } = await agent.post("/fixtures").send({ scenario: "create-file" });

  const { status, body } = await agent
    .put(
      `${
        new URL(url).pathname
      }/repos/octokit-fixture-org/create-file/contents/test.txt`,
    )
    .set({
      accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
    })
    .send({
      message: "wrong message",
      content: "wrong content",
    })
    .catch((error) => error.response);

  t.equal(status, 404);
  t.equal(body.error, "Nock: No match for request");

  t.end();
});

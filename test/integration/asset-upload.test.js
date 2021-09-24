import express from "express";
import supertest from "supertest";
import { suite } from "uvu";
import * as assert from "uvu/assert";

import { getScenarioFixture } from "../util.js";
import middleware from "../../index.js";

const test = suite("asset-upload");

test("release asset (gr2m/octokit-rest-browser-experimental#5)", async () => {
  const app = express();
  app.use(
    middleware({
      logLevel: "error",
      ttl: 1000,
      fixtures: {
        "release-assets": getScenarioFixture("release-assets"),
      },
    })
  );

  const agent = supertest(app);
  const {
    body: { id: fixtureId },
  } = await agent.post("/fixtures").send({ scenario: "release-assets" });
  const {
    body: { upload_url: updateUrl },
  } = await agent
    .get(
      `/api.github.com/${fixtureId}/repos/octokit-fixture-org/release-assets/releases/tags/v1.0.0`
    )
    .set({
      accept: "application/vnd.github.v3+json",
      authorization: "token 0000000000000000000000000000000000000001",
    });

  assert.equal(
    updateUrl,
    `http://localhost:3000/uploads.github.com/${fixtureId}/repos/octokit-fixture-org/release-assets/releases/1000/assets{?name,label}`
  );

  const result = await agent
    .post(
      `/uploads.github.com/${fixtureId}/repos/octokit-fixture-org/release-assets/releases/1000/assets`
    )
    .query({
      name: "test-upload.txt",
      label: "test",
    })
    .send("Hello, world!\n")
    .set({
      accept: "application/vnd.github.v3+json",
      authorization: "token 0000000000000000000000000000000000000001",
      "content-type": "text/plain",
      "content-length": 14,
    })
    .catch((error) => console.log(error.stack));

  assert.equal(result.body.name, "test-upload.txt");
});

test.run();

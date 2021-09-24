import express from "express";
import supertest from "supertest";
import { suite } from "uvu";
import * as assert from "uvu/assert";

import middleware from "../../index.js";

const test = suite("load fixtures");

test("create fixture success", () => {
  const app = express();
  app.use(
    middleware({
      logLevel: "error",
      ttl: 1000,
    })
  );

  return supertest(app)
    .post("/fixtures")
    .send({ scenario: "get-repository" })
    .then((response) => {
      const { id, url } = response.body;
      assert.ok(id);
      assert.equal(url, `http://localhost:3000/api.github.com/${id}`);
    });
});

test("create fixture error", () => {
  const app = express();
  app.use(
    middleware({
      logLevel: "error",
      ttl: 1,
    })
  );

  return supertest(app)
    .post("/fixtures")
    .send({ scenario: "nope" })
    .catch((error) => error.response)
    .then((response) => {
      assert.equal(response.status, 400);
      assert.equal(response.body.error, 'Scenario "nope" not found');
    });
});

test("create fixture with custom url", () => {
  const app = express();
  app.use(
    middleware({
      logLevel: "error",
      ttl: 1000,
      fixturesUrl: "https://deployment-123.my-fixtures.com",
    })
  );

  return supertest(app)
    .post("/fixtures")
    .send({ scenario: "get-repository" })
    .then((response) => {
      const { id, url } = response.body;
      assert.ok(id);
      assert.equal(
        url,
        `https://deployment-123.my-fixtures.com/api.github.com/${id}`
      );
    });
});

test.run();

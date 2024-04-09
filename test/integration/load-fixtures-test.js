import express from "express";
import supertest from "supertest";
import { test } from "tap";

import middleware from "../../index.js";

test("create fixture success", (t) => {
  const app = express();
  app.use(
    middleware({
      logLevel: "error",
      ttl: 1000,
    }),
  );

  supertest(app)
    .post("/fixtures")
    .send({ scenario: "get-repository" })
    .then((response) => {
      const { id, url } = response.body;
      t.ok(id);
      t.equal(url, `http://localhost:3000/api.github.com/${id}`);
      t.end();
    })
    .catch(t.error);
});

test("create fixture error", (t) => {
  const app = express();
  app.use(
    middleware({
      logLevel: "error",
      ttl: 1,
    }),
  );

  supertest(app)
    .post("/fixtures")
    .send({ scenario: "nope" })
    .catch((error) => error.response)
    .then((response) => {
      t.equal(response.status, 400);
      t.equal(response.body.error, 'Scenario "nope" not found');
      t.end();
    })
    .catch(t.error);
});

test("create fixture with custom url", (t) => {
  const app = express();
  app.use(
    middleware({
      logLevel: "error",
      ttl: 1000,
      fixturesUrl: "https://deployment-123.my-fixtures.com",
    }),
  );

  supertest(app)
    .post("/fixtures")
    .send({ scenario: "get-repository" })
    .then((response) => {
      const { id, url } = response.body;
      t.ok(id);
      t.equal(
        url,
        `https://deployment-123.my-fixtures.com/api.github.com/${id}`,
      );
      t.end();
    })
    .catch(t.error);
});

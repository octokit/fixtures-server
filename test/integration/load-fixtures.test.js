import express from "express";
import supertest from "supertest";

import middleware from "../../index.js";

test("create fixture success", (done) => {
  const app = express();
  app.use(
    middleware({
      logLevel: "error",
      ttl: 1000,
    })
  );

  supertest(app)
    .post("/fixtures")
    .send({ scenario: "get-repository" })
    .then((response) => {
      const { id, url } = response.body;
      expect(id).toBeTruthy();
      expect(url).toBe(`http://localhost:3000/api.github.com/${id}`);
      done();
    })
    .catch(done.fail);
});

test("create fixture error", (done) => {
  const app = express();
  app.use(
    middleware({
      logLevel: "error",
      ttl: 1,
    })
  );

  supertest(app)
    .post("/fixtures")
    .send({ scenario: "nope" })
    .catch((error) => error.response)
    .then((response) => {
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Scenario "nope" not found');
      done();
    })
    .catch(done.fail);
});

test("create fixture with custom url", (done) => {
  const app = express();
  app.use(
    middleware({
      logLevel: "error",
      ttl: 1000,
      fixturesUrl: "https://deployment-123.my-fixtures.com",
    })
  );

  supertest(app)
    .post("/fixtures")
    .send({ scenario: "get-repository" })
    .then((response) => {
      const { id, url } = response.body;
      expect(id).toBeTruthy();
      expect(url).toBe(
        `https://deployment-123.my-fixtures.com/api.github.com/${id}`
      );
      done();
    })
    .catch(done.fail);
});

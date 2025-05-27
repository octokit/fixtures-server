export default fixtureServerMiddleware;

import bodyParser from "body-parser";
import cachimo from "cachimo";
import { Router } from "express";
import fixtures from "@octokit/fixtures";
import Log from "console-log-level";

import additions from "./lib/additions.js";
import proxy from "./lib/proxy.js";

import DEFAULTS from "./lib/defaults.js";

function fixtureServerMiddleware(options) {
  const middleware = Router();

  const state = Object.assign({}, DEFAULTS, options);

  if (!state.fixturesUrl) {
    state.fixturesUrl = `http://localhost:${state.port}`;
  }

  state.cachimo = cachimo;
  state.log = Log({
    level: state.logLevel === "silent" ? "fatal" : state.logLevel,
  });

  middleware.post("/fixtures", bodyParser.json(), (request, response) => {
    const id = Math.random().toString(36).substr(2);
    const requestedFixture = state.fixtures[request.body.scenario];

    if (!requestedFixture) {
      return response.status(400).json({
        error: `Scenario "${request.body.scenario}" not found`,
      });
    }

    const mock = fixtures.mock(requestedFixture, (fixture) =>
      additions(state, { id, fixture }),
    );

    cachimo
      .put(id, mock, state.ttl)
      .then(() => {
        state.log.debug(
          `Deleted fixtures "${id}" (${mock.pending().length} pending)`,
        );
      })
      // throws error if key was deleted before timeout, safe to ignore
      .catch(() => {});

    const path = new URL(requestedFixture[0].scope).hostname + "/" + id;
    response.status(201).json({
      id,
      url: new URL(path, state.fixturesUrl).href,
    });
  });

  // load proxies for all unique scope URLs in fixtures
  Object.values(state.fixtures)
    .flat()
    .map((fixture) => fixture.scope.replace(/:(80|443)$/, ""))
    .filter((url, i, arr) => arr.indexOf(url) === i)
    .forEach((target) => {
      middleware.use(proxy(state, { target }));
    });

  return middleware;
}

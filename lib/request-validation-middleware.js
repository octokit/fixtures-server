export default requestValidationMiddleware;

import { URL } from "url";

function requestValidationMiddleware(state, request, response, next) {
  if (!request.headers.accept) {
    return response.status(400).json({
      error: "Accept header required",
    });
  }

  const mock = state.cachimo.get(request.params.fixturesId);

  if (!mock) {
    return response.status(404).json({
      error: `Fixture "${request.params.fixturesId}" not found`,
    });
  }

  const [nextFixture] = mock.pending();

  const nextFixtureMethod = nextFixture.split(" ")[0].toUpperCase();
  const nextFixturePath = new URL(
    nextFixture.substr(nextFixtureMethod.length + 1)
  ).pathname;

  if (
    request.method !== nextFixtureMethod ||
    request.path !== nextFixturePath
  ) {
    return response.status(404).json({
      error: `${request.method} ${request.path} does not match next fixture: ${nextFixtureMethod} ${nextFixturePath}`,
      detail: {
        pending: mock.pending(),
      },
    });
  }

  next();
}

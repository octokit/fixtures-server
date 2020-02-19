module.exports = proxy;

const { URL } = require("url");

const express = require("express");

const { createProxyMiddleware } = require("http-proxy-middleware");

const validateRequest = require("./request-validation-middleware");

function proxy(state, { target }) {
  const middleware = express.Router();
  const { protocol, hostname } = new URL(target);

  middleware.use(
    `/${hostname}/:fixturesId`,
    validateRequest.bind(null, state),
    createProxyMiddleware({
      target: target,
      router(req) {
        const fixturesId = req.path.split("/")[2];
        const target = `${protocol}//fixtures-${fixturesId}.${hostname}`;
        return target;
      },
      changeOrigin: true,
      logLevel: state.logLevel,
      pathRewrite: {
        "^/[^/]+/[\\w]+/": "/"
      },
      onError(error, request, response) {
        /* istanbul ignore if */
        if (error.message.indexOf("Nock: No match for request") !== 0) {
          return response.end(
            JSON.stringify({
              error: error.message
            })
          );
        }

        response.writeHead(404, {
          "Content-Type": "application/json; charset=utf-8"
        });

        const [expected] = error.message
          .substr("Nock: No match for request ".length)
          .split(" Got instead ");

        response.end(
          JSON.stringify(
            {
              error: "Nock: No match for request",
              detail: {
                expected: JSON.parse(expected)
              }
            },
            null,
            2
          ) + "\n"
        );
      },
      onProxyRes(proxyRes, request, response) {
        const mock = state.cachimo.get(request.params.fixturesId);
        if (mock.isDone()) {
          state.cachimo.remove(request.params.fixturesId);
          state.log.debug(`Fixtures "${request.params.fixturesId}" completed`);
        }
      }
    })
  );

  return middleware;
}

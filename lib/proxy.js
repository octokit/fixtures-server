module.exports = proxy

const urlParse = require('url').parse

const express = require('express')

const httpProxyMiddleware = require('http-proxy-middleware')

const validateRequest = require('./request-validation-middleware')

function proxy (state, {target}) {
  const middleware = express.Router()
  const hostname = urlParse(target).hostname

  middleware.use(`/${hostname}`, validateRequest.bind(null, state), httpProxyMiddleware({
    target: target,
    changeOrigin: true,
    logLevel: state.logLevel,
    pathRewrite: {
      '^/[^/]+/': '/'
    },
    onError (error, request, response) {
      /* istanbul ignore if */
      if (error.message.indexOf('Nock: No match for request') !== 0) {
        response.writeHead(404, {
          'Content-Type': 'application/json; charset=utf-8'
        })

        return response.end(JSON.stringify({
          error: error.message
        }))
      }

      response.writeHead(404, {
        'Content-Type': 'application/json; charset=utf-8'
      })

      const [expected, actual] = error.message
        .substr('Nock: No match for request '.length)
        .split(' Got instead ')

      response.end(JSON.stringify({
        error: 'Nock: No match for request',
        detail: {
          expected: JSON.parse(expected),
          actual: JSON.parse(actual)
        }
      }, null, 2) + '\n')
    },
    onProxyRes (proxyRes, request, response) {
      const fixturesId = request.headers['x-fixtures-id']
      const mock = state.cachimo.get(fixturesId)
      if (mock.isDone()) {
        state.cachimo.remove(fixturesId)
        state.log.debug(`Fixtures "${fixturesId}" completed`)
      }
    }
  }))

  return middleware
}

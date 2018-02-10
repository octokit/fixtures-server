# fixtures-server

> Fixtures server for browser & language agnositic octokit testing

[![Build Status](https://travis-ci.org/octokit/fixtures-server.svg?branch=master)](https://travis-ci.org/octokit/fixtures-server)
[![Coverage Status](https://coveralls.io/repos/octokit/fixtures-server/badge.svg?branch=master)](https://coveralls.io/github/octokit/fixtures-server?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/octokit/fixtures-server.svg)](https://greenkeeper.io/)

The Octokit Fixtures Server is proxies requests to the mocked routes
provided by [@octokit/fixtures](https://github.com/octokit/fixture).

- [Usage](#usage)
- [How it works](HOW_IT_WORKS.md)
- [Contributing](CONTRIBUTING.md)
- [License](#license)

## Usage

You can use `@octokit/fixtures-server` as [standalone server](#standaloneserver)
or as [express middleware](#expressmiddleware).

### Standalone Server

Download binary for your os from the [latest release](https://github.com/octokit/fixtures-server/releases/latest).

Alternatively, you can also install `@octokit/fixtures-server` as a global npm package, if you prefer that:

```
npm install --global @octokit/fixtures-server
octokit-fixtures-server
```

By default it loads all mocks from [`@octokit/fixtures/scenarios/api.github.com/*/normalized-fixture.json`](http://github.com/octokit/fixtures/tree/master/scenarios/api.github.com/).
Once started you can load a fixture with a `POST /fixtures` request with the scenario name in the request body, e.g. `get-repository`

```
curl -XPOST -H'Content-Type: application/json' http://localhost:3000/fixtures -d '{"scenario": "get-repository"}'
{"id":"123","url":"http://localhost:3000/api.github.com"}
```

Then send a request to the returned `url` as if it was https://api.github.com. Make sure to pass the returned `id` as `X-Fixtures-Id` header

```
curl -H'Accept: application/vnd.github.v3+json' -H'X-Fixtures-Id: 123' http://localhost:3000/api.github.com/repos/octokit-fixture-org/hello-world
# returns response from fixture
```

After that request the fixture is "consumed". That allows for scenarios where the same request returns different responses based on order of requests.

<a name="standalone-server-options"></a>
#### Options

<!-- Edit at http://www.tablesgenerator.com/markdown_tables -->
| CLI option     | ENV variable | default                                                                 | description                                                                                                                              |
|----------------|--------------|-------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| --port         | PORT         | `3000`                                                                  | Server port number                                                                                                                       |
| --fixtures-url | FIXTURES_URL | `'http://localhost:<port>'`                                             | URL to handle fixture requests (This helps with continuous deployments)                                                                  |
| --log-level    | LOG_LEVEL    | `'info'`                                                                | One of `'debug'`, `'info'`, `'warn'`, `'error'`, `'silent'`                                                                              |
| --ttl          | TTL          | `60000`                                                                 |  Expiration time for loaded fixtures in ms                                                                                               |
| --fixtures     | FIXTURES     | `'node_modules/@octokit/fixtures/scenarios/**/normalized-fixture.json'` | glob path to load JSON fixture files recorded with nock. Make sure to wrap the value with quotes, e.g. `--fixtures='./scenarios/*.json'` |

### Express Middleware

```js
const express = require('express')
const app = express()

const fixturesServer = require('@octokit/fixtures-server')
app.use(fixturesServer({
  fixtures: {
    'my-scenario': require('./scenarios/my-scenario.json')
  }
}))

app.listen(3000)
```

#### Options

| Option        | Default                                                                                                                              | Descriptio                                                                    |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| `fixturesUrl` | `'http://localhost:<port>'`                                                                                                          | URL to handle fixture requests (This helps with continuous deployments)       |
| `logLevel`    | `'info'`                                                                                                                             | One of `'debug'`, `'info'`, `'warn'`, `'error'`, `'silent'`                   |
| `ttl`         | `60000`                                                                                                                              |  Expiration time (time to live) for loaded fixtures in ms                     |
| `fixtures`    | fixtures from [@octokit/fixtures/scenarios/api.github.com](https://github.com/octokit/fixtures/tree/master/scenarios/api.github.com) | Object with keysbeing the scenario names and values being the fixtures arrays |

## License

[MIT](LICENSE.md)

# fixtures-server

> Fixtures server for browser & language agnositic octokit testing

[![Test](https://github.com/octokit/fixtures-server/workflows/Test/badge.svg?branch=main)](https://github.com/octokit/fixtures-server/actions?query=workflow%3ATest+branch%3Amain)

The Octokit Fixtures Server is proxies requests to the mocked routes
provided by [@octokit/fixtures](https://github.com/octokit/fixtures).

- [Usage](#usage)
- [How it works](HOW_IT_WORKS.md)
- [Contributing](CONTRIBUTING.md)
- [License](#license)

## Usage

1. Load a fixture. All folder names at [@octokit/fixtures/scenarios/api.github.com](https://github.com/octokit/fixtures/tree/main/scenarios/api.github.com/)
   are valid values for `scenario`.

   ```
   curl -XPOST -H'Content-Type: application/json' http://localhost:3000/fixtures -d '{"scenario": "get-repository"}'
   ```

   The response looks something like this

   ```json
   {
     "id": "fixturesid123",
     "url": "http://localhost:3000/api.github.com/fixturesid123/api.github.com/fixturesid123"
   }
   ```

2. Send a request to the returned `url` as if it was https://api.github.com.

   ```
   curl -H'Authorization: token 0000000000000000000000000000000000000001' -H'Accept: application/vnd.github.v3+json' http://localhost:3000/api.github.com/fixturesid123/repos/octokit-fixture-org/hello-world
   ```

After that request the fixture is "consumed". That allows for different responses for the same requests based on order.

If you want to load custom fixtures, you'll have to use `@octokit/fixtures-server` as [standalone server](#standaloneserver)
or as as [express middleware](#expressmiddleware).

### Standalone Server

Download binary for your os from the [latest release](https://github.com/octokit/fixtures-server/releases/latest).

Alternatively, you can also install `@octokit/fixtures-server` as a global npm package, if you prefer that:

```
npm install --global @octokit/fixtures-server
```

By default the server runs at http://localhost:3000

```
octokit-fixtures-server
```

<a name="standalone-server-options"></a>

#### Options

<!-- Edit at http://www.tablesgenerator.com/markdown_tables -->

| CLI option     | ENV variable | default                                                                 | description                                                                                                                              |
| -------------- | ------------ | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| --port         | PORT         | `3000`                                                                  | Server port number                                                                                                                       |
| --fixtures-url | FIXTURES_URL | `'http://localhost:<port>'`                                             | URL to handle fixture requests (This helps with continuous deployments)                                                                  |
| --log-level    | LOG_LEVEL    | `'info'`                                                                | One of `'debug'`, `'info'`, `'warn'`, `'error'`, `'silent'`                                                                              |
| --ttl          | TTL          | `60000`                                                                 | Expiration time for loaded fixtures in ms                                                                                                |
| --fixtures     | FIXTURES     | `'node_modules/@octokit/fixtures/scenarios/**/normalized-fixture.json'` | glob path to load JSON fixture files recorded with nock. Make sure to wrap the value with quotes, e.g. `--fixtures='./scenarios/*.json'` |

### Express Middleware

```js
const express = require("express");
const app = express();

const fixturesServer = require("@octokit/fixtures-server");
app.use(
  fixturesServer({
    fixtures: {
      "my-scenario": require("./scenarios/my-scenario.json"),
    },
  })
);

app.listen(3000);
```

#### Options

| Option        | Default                                                                                                                            | Descriptio                                                                    |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `fixturesUrl` | `'http://localhost:<port>'`                                                                                                        | URL to handle fixture requests (This helps with continuous deployments)       |
| `logLevel`    | `'info'`                                                                                                                           | One of `'debug'`, `'info'`, `'warn'`, `'error'`, `'silent'`                   |
| `ttl`         | `60000`                                                                                                                            | Expiration time (time to live) for loaded fixtures in ms                      |
| `fixtures`    | fixtures from [@octokit/fixtures/scenarios/api.github.com](https://github.com/octokit/fixtures/tree/main/scenarios/api.github.com) | Object with keysbeing the scenario names and values being the fixtures arrays |

## License

[MIT](LICENSE.md)

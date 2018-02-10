# Contributing

* [Requirements & local setup](#requirements--local-setup)
* [Test users / organization / tokens](#test-users--organization--tokens)
* [Record](#record)
* [Server](#server)
* [Tests](#tests)
* [Coverage](#coverage)

Thanks for wanting to contribute to the Octokit Fixtures, your help is more than
welcome. If you have a question about contributing, please open an issue!

For a general overview of how the Octokit Fixtures Server works have a look at [HOW_IT_WORKS.md](HOW_IT_WORKS.md).

Please abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## Requirements & local setup

Octokit Fixtures Server requires Node 8 in order to run its tests.

The basic setup is

```
git clone https://github.com/octokit/fixtures-server.git octokit-fixtures-server
cd octokit-fixtures
npm install
npm test
```

To start the server

```
npm start
```

## Tests

Run integration & unit tests with

```
npm test
```

Run the end-to-end test with

```
npm run test:e2e
```

## Coverage

After running tests, a coverage report can be generated that can be browsed locally.

```
npm run coverage
```

## Releases

Releases are automated using [semantic-release](https://github.com/semantic-release/semantic-release).
The following commit message conventions determine which version is released:

1. `fix: ...` or `fix(scope name): ...` prefix in subject: bumps fix version, e.g. `1.2.3` → `1.2.4`
2. `feat: ...` or `feat(scope name): ...` prefix in subject: bumps feature version, e.g. `1.2.3` → `1.3.0`
3. `BREAKING CHANGE:` in body: bumps breaking version, e.g. `1.2.3` → `2.0.0`

Only one version number is bumped at a time, the highest version change trumps the others.

The server binaries are generated and uploaded to new releases automatically.

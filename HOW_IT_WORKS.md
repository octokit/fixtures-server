# How it works

The Octokit Fixtures server is [a simple express app](bin/serve.js)
which uses the [http-proxy-middleware package](https://www.npmjs.com/package/http-proxy-middleware)
to proxy requests to the mocked routes provided by [@octokit/fixtures](https://github.com/octokit/fixtures)

Fixtures are loaded with [nock](https://github.com/node-nock/nock). `nock`
intercepts all requests by patching low-level Node APIs that send http requests.
All mocks loaded with `nock` are stored globally, which can quickly lead to
false positives due to mocks loaded earlier. To avoid that problem we dynamically
change the scope for each loaded fixture, from something like `api.github.com:443`
to something like `fixtures-id123.github.com:443`.

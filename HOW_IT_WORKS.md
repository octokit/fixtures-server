# How it works

The Octokit Fixtures server is [a simple express app](bin/serve.js)
which uses the [http-proxy-middleware package](https://www.npmjs.com/package/http-proxy-middleware)
to proxy requests to the mocked routes provided by [@octokit/fixtures](https://github.com/octokit/fixture)

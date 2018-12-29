#!/usr/bin/env bash

npm link .
octokit-fixtures-server &
serverPid=$!

sleep 3

# get fixtures id & url
FIXTURES=`curl -XPOST -H'Content-Type: application/json' http://localhost:3000/fixtures -d '{"scenario": "get-repository"}'`
URL=`echo $FIXTURES | grep -o '"url":\s*"[^"]*' | sed -E 's/"url":\s*"([^"]+)/\1/'`

# send request using id & url, test if output contains expected string
# If it does not return exit code accordingly
curl -H"Accept: application/vnd.github.v3+json" -H"Authorization: token 0000000000000000000000000000000000000001" $URL/repos/octokit-fixture-org/hello-world | grep -q '"full_name":"octokit-fixture-org/hello-world"'
returnCode=$? # is 1 if grep could not find string above

# kill server and exit with exit code from above test
kill $serverPid
exit $returnCode

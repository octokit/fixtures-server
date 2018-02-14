#!/usr/bin/env bash

npm link .
octokit-fixtures-server --fixtures='test/end-to-end/my-custom-scenario.json' &
serverPid=$!

sleep 3

# get fixtures id & url
FIXTURES=`curl -XPOST -H'Content-Type: application/json' http://localhost:3000/fixtures -d '{"scenario": "my-custom-scenario"}'`
URL=`echo $FIXTURES | grep -o '"url":\s*"[^"]*' | sed -E 's/"url":\s*"([^"]+)/\1/'`

# send request using id & url, test if output contains expected string
# If it does not return exit code accordingly
curl -H"Accept: application/vnd.github.v3+json" $URL/repos/martinb3/welcome | grep -q '"full_name":"martinb3/welcome"'
returnCode=$? # is 1 if grep could not find string above

# kill server and exit with exit code from above test
kill $serverPid
exit $returnCode

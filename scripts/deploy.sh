#!/bin/sh

now="npx now --token=$NOW_TOKEN"

# delete deployments that are currently not aliased
$now rm --safe --yes octokit-fixtures

# deploy
$now --public

# set alias
$now alias

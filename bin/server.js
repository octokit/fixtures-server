#!/usr/bin/env node

const cors = require('cors')
const express = require('express')
const yargs = require('yargs')

const fixtureServereMiddleware = require('..')
const globTofixtures = require('../lib/glob-to-fixtures')

const DEFAULTS = require('../lib/defaults')

const { argv } = yargs.options({
  port: {
    type: 'number',
    default: parseInt(process.env.PORT || DEFAULTS.port, 10)
  },
  'fixtures-url': {
    type: 'string',
    default: parseInt(process.env.FIXTURES_URL || DEFAULTS.fixturesUrl, 10)
  },
  'log-level': {
    type: 'string',
    describe: 'Set logging level for Express',
    default: process.env.LOG_LEVEL || DEFAULTS.logLevel
  },
  ttl: {
    type: 'number',
    describe: 'Expiration time for loaded fixtures in ms',
    default: parseInt(process.env.TTL || DEFAULTS.ttl, 10)
  },
  fixtures: {
    type: 'string',
    description: 'glob path for JSON fixture files created by nock',
    default: process.env.FIXTURES || DEFAULTS.fixturesGlob
  }
}).help()

const app = express()
app.use(cors())
app.use(fixtureServereMiddleware({
  port: argv.port,
  fixturesUrl: argv['fixtures-url'],
  logLevel: argv['log-level'],
  ttl: argv.ttl,
  fixtures: globTofixtures(argv.fixtures)
}))

app.listen(argv.port)
console.log(`🌐  http://localhost:${argv.port}`)

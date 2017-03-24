// /index.js
'use strict'

const server = require('./config/initializers/server')
const database = require('./config/initializers/database')
const async = require('async')

// Retrieve environnment variables
require('dotenv').config()

// Start Server
console.log('[APP] Starting server initialization')

// Initialize Modules
async.parallel([
  function initializeDBConnection (cb) {
    // Initialize Database
    database(cb)
  },
  function startServer (cb) {
    // Initialize Server
    server(cb)
  }], function (err) {
  if (err) {
    console.log('[APP] initialization failed', err)
  } else {
    console.log('[APP] initialized SUCCESSFULLY')
  }
})


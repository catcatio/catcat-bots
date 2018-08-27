const concurrently = require('concurrently')

concurrently([
  'npm:build',
  'npm:dev'
], {
  prefix: 'name',
  killOthers: ['failure', 'success'],
  restartTries: 3,
})
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgres://saidmimouni:azazaz@localhost/sql2rest';

global.app      = require('../index');
global.db       = require('../lib/db');
global.request  = require('supertest');

const cp = require('child_process');

beforeEach(function(done) {
  cp.exec('npm run fixtures', (err, stdout, stderr) => {
    done();
  });
});

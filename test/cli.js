'use strict';

const chai = require('chai');
const execa = require('execa');
const path = require('path');

const busted = /v4|v6/.test(process.version) ? '--old-and-busted' : '';
const cli = (args, opts) => {
  const cliPath = path.join(cwd, 'cli');
  const params = [cliPath].concat(args, busted);

  return execa(process.execPath, params, opts);
};
const cwd = path.dirname(__dirname);
const expect = chai.expect;
const pkg = require(path.join(cwd, 'package.json'));

describe('mocha-chrome binary', () => {

  it('should report version', async () => {
    const { stdout } = await cli(['--version'], {cwd});

    expect(stdout).to.equal(pkg.version);
  });

  it('should run a successful test', async () => {
    const { code } = await cli(['test/html/test.html'], {cwd});
    expect(code).to.equal(0);
  });

  it('should run a failing test', (done) => {
    cli(['test/html/fail.html'], {cwd}).catch(err => {
      expect(err.code).to.equal(1);
      expect(err.stdout).to.match(/1 failing/);
      done();
    });
  });

});

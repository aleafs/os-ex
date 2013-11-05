/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */

/* jshint immed: false */

"use strict";

var os = require('os');
var should = require('should');
var sysinfo = require(__dirname + '/../');

describe('default sysinfo interface', function () {

  it('should_os_works_fine', function () {
    should.ok(true);
    sysinfo.platform().should.eql(os.platform());
  });
});


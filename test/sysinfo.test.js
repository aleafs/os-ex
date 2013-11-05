/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */

/* jshint immed: false */

"use strict";

var fs = require('fs');
var mm = require('mm');
var should = require('should');
var sysinfo = require(__dirname + '/../');

describe('default sysinfo interface', function () {

  beforeEach(function () {
    mm.restore();
  });

  it('should linux extend work fine', function () {

    var filecontent = {
      '/proc/10428/stat' : '10428 (java) S 1 10292 9206 0 -1 4202496 922248 0 0 0 31249 35076 0 0 25 0 70 0 7309523429 818688000 64160 18446744073709551615 1073741824 1073778376 140737189838160 18446744073709551615 270627010533 0 0 2 16800973 18446744073709551615 0 0 17 2 0 0 0\n',
    };

    mm(fs, 'readFileSync', function (x) {
      if (x in filecontent) {
        return filecontent[x];
      }

      throw new Error("ENOENT, no such file or directory '" + x + "'");
    });

    var _me = sysinfo.__extends.linux;
    _me.procstat(111).should.eql({});
    _me.procstat(10428).should.eql({
      'pid' : 10428,
      'state' : 'S',
      'ppid' : 1,
      'utime' : 31249,
      'stime' : 35076,
      'cutime' : 0,
      'cstime' : 0,
      'vsize' : 818688000,
      'rss' : 64160,
      'cpu' : 2,
    });
  });

  it('should_cpuusage_works_fine', function () {
    sysinfo.cpuusage().should.eql(0)
  });
});


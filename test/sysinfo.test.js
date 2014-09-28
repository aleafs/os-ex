/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */

/* jshint immed: false */

"use strict";

var fs = require('fs');
var mm = require('mm');
var should = require('should');
var sysinfo = require(__dirname + '/../');

describe('default sysinfo interface', function () {

  afterEach(function () {
    mm.restore();
  });

  /* {{{ should darwin extend works fine() */
  it('should darwin extend works fine', function () {
    var _me = sysinfo.__extends.darwin;
    _me.cputime().should.have.property('cpu');
  });
  /* }}} */

  /* {{{ should_cpuusage_works_fine() */
  it('should_cpuusage_works_fine', function () {
    sysinfo.cpuusage().should.eql(0)
  });
  /* }}} */

  /* {{{ should linux extend works fine() */
  it('should linux extend works fine', function () {

    var _readFileSync = fs.readFileSync;
    mm(fs, 'readFileSync', function () {
      var x = arguments;
      x[0] = __dirname + '/data/' + x[0];

      return _readFileSync.apply(null, x);
    });

    var _me = sysinfo.__extends.linux;

    _me.cputime().should.eql({
      'cpu' : {
        'user'  : 42314893,
        'nice'  : 11732760,
        'sys'   : 24846625,
        'idle'  : 31935243338,
        'irq'   : 494667,
      },
      'cpu0' : {
        'user'  : 4262755,
        'nice'  : 515169,
        'sys'   : 3321273,
        'idle'  : 8060525027,
        'irq'   : 22579,
      },
    });

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
    });

    _me.netflowsize().should.eql({
      'eth0' : {
        'bytin' : 11210125716974,
        'pktin' : 51900851777,
        'bytout' : 7183377475697,
        'pktout' : 7220239841,
      },
      'lo' : {
        'bytin' : 40780802359,
        'pktin' : 191777868,
        'bytout' : 40780802359,
        'pktout' : 191777868,
      },
    });

    _me.meminfo().should.eql({
      'buffers' : 1048301568,
      'cached'  : 10726449152,
      'free'    : 2440630272,
      'total'   : 16834637824,
      'used'    : 2619256832,
    });
  });
  /* }}} */

});


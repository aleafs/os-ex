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

  /* {{{ should darwin extend works fine() */
  it('should darwin extend works fine', function () {
    var _me = sysinfo.__extends.darwin;
    _me.cputime().should.have.property('cpu');
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
        'Receive' : {
          'bytes' : 11210125716974,
          'packets' : 51900851777,
          'errs' : 0,
          'drop' : 2032653,
          'fifo' : 0,
          'frame' : 0,
          'compressed' : 0,
          'multicast' : 6,
        },
        'Transmit' : {
          'bytes' : 7183377475697,
          'packets' : 7220239841,
          'errs' : 0,
          'drop' : 0,
          'fifo' : 0,
          'colls' : 0,
          'carrier' : 0,
          'compressed' : 0,
        }
      },
      'lo' : {
        "Receive": {
          "bytes": 40780802359,
          "compressed": 0,
          "drop": 0,
          "errs": 0,
          "fifo": 0,
          "frame": 0,
          "multicast": 0,
          "packets": 191777868,
        },
        "Transmit": {
          "bytes": 40780802359,
          "carrier": 0,
          "colls": 0,
          "compressed": 0,
          "drop": 0,
          "errs": 0,
          "fifo": 0,
          "packets": 191777868,
        }
      },
    });
  });
  /* }}} */

  /* {{{ should_cpuusage_works_fine() */
  it('should_cpuusage_works_fine', function () {
    sysinfo.cpuusage().should.eql(0)
  });
  /* }}} */

});


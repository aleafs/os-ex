/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */

"use strict";

var fs = require('fs');

var _saferead = function (x) {
  try {
    return fs.readFileSync(x, 'utf8');
  } catch (ex) {
    return '';
  }
};

exports.procstat = function (pid) {
  var res = {};
  var x = _saferead('/proc/' + pid + '/stat').split(' ');
  if (x && x.length >= 24) {
    res = {
      'pid' : x[0] - 0,
      'state' : x[2].trim(),
      'ppid'  : x[3] - 0,
      'utime' : x[13] - 0,
      'stime' : x[14] - 0,
      'cutime' : x[15] - 0,
      'cstime' : x[16] - 0,
      'vsize' : x[22] - 0,
      'rss' : x[23] - 0,
    };
  }

  return res;
};

exports.cputime = function () {
  var res = {};
  _saferead('/proc/stat').split('\n').forEach(function (row) {
    row = String(row).match(/\S+/g);
    if (!row) {
      return;
    }
    if ('cpu' === row[0].substring(0, 3)) {
      res[row[0]] = {
        'user' : row[1] - 0,
        'nice' : row[2] - 0,
        'sys' : row[3] - 0,
        'idle' : row[4] - 0,
        'irq' : row[6] - 0,
      };
    }
  });

  return res;
};

exports.netflowsize = function () {
  var res = {};
  _saferead('/proc/net/dev').split('\n').forEach(function (row) {
    row = String(row).split(':');
    if (!row || row.length < 2) {
      return;
    }

    var xxx = row[1].match(/\S+/g);
    if (!xxx || xxx.length < 16) {
      return;
    }

    res[row[0].trim()] = {
      'Receive' : {
        'bytes' : xxx[0] - 0,
        'packets' : xxx[1] - 0,
        'errs' : xxx[2] - 0,
        'drop' : xxx[3] - 0,
        'fifo' : xxx[4] - 0,
        'frame' : xxx[5] - 0,
        'compressed' : xxx[6] - 0,
        'multicast' : xxx[7] - 0,
      },
      'Transmit' : {
        'bytes' : xxx[8] - 0,
        'packets' : xxx[9] - 0,
        'errs' : xxx[10] - 0,
        'drop' : xxx[11] - 0,
        'fifo' : xxx[12] - 0,
        'colls' : xxx[13] - 0,
        'carrier' : xxx[14] - 0,
        'compressed' : xxx[15] - 0,
      }
    };
  });

  return res;
};


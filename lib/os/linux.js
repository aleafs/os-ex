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
      'bytin' : xxx[0] - 0,
      'pktin' : xxx[1] - 0,
      'bytout' : xxx[8] - 0,
      'pktout' : xxx[9] - 0,
    };
  });

  return res;
};

exports.meminfo = function () {
  var res = {};
  var map = {
    'MemTotal' : 'total',
    'MemFree'  : 'free',
    'Buffers'  : 'buffers',
    'Cached'   : 'cached',
  };

  var xxx = {
    'kB' : 1024,
  };
  _saferead('/proc/meminfo').split('\n').forEach(function (row) {
    row = String(row).match(/(\w+):\s*(\d+)\s*(\w+)?/);
    if (row && map[row[1]]) {
      var n = row[2] - 0;
      if (row[3] && xxx[row[3]]) {
        n *= xxx[row[3]];
      }
      res[map[row[1]]] = n;
    }
  });

  res.used = res.total - res.free - res.buffers - res.cached;

  return res;
};


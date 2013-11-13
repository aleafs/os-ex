/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */

"use strict";

var fs = require('fs');
var path = require('path');
var os = require('os');

var sysinfo = os;

if (!sysinfo.networkInterfaces) {
  sysinfo.networkInterfaces = sysinfo.getNetworkInterfaces;
}

/**
 * @平台扩展
 */
sysinfo.__extends = {};

fs.readdirSync(__dirname + '/os').forEach(function (x) {
  x = String(x).match(/^([^\.\_]+)\.js$/);
  if (x) {
    sysinfo.__extends[x[1]] = require(path.join(__dirname, 'os', x[0]));
  }
});

var __osextends = sysinfo.__extends[os.platform()];
for (var i in __osextends) {
  sysinfo[i] = __osextends[i];
}

/* {{{ */
var _processcputime = function (pid) {
  var x = sysinfo.procstat(pid);
  if (!x || !x.pid) {
    return 0;
  }

  return x.utime + x.stime;
};

var _totalcputime = function () {
  var x = sysinfo.cputime();
  if (!x.cpu) {
    return 0;
  }

  var a = 0;
  var n = Object.keys(x).length - 1;
  ['user', 'nice', 'sys', 'idle', 'irq'].forEach(function (i) {
    a += Number(x.cpu[i]) || 0;
  });

  return Math.round(a / Math.max(1, n));
};

var __totalcpuusage = 0;
var __cpuusagecache = {};
setInterval(function () {

  var A = _totalcputime();
  var D = A - __totalcpuusage;

  __totalcpuusage = A;

  if (D <= 0) {
    return;
  }

  var N = 0;
  var T = Date.now() - 300000;
  for (var pid in __cpuusagecache) {
    if (__cpuusagecache[pid].hit < T) {
      delete __cpuusagecache[pid];
      return;
    }

    N = _processcputime(pid);
    __cpuusagecache[pid].per = Math.round(100 * (N - __cpuusagecache[pid].val) / D);
    __cpuusagecache[pid].val = N;
  }

}, 1000);
/* }}} */

sysinfo.cpuusage = function (pid) {
  pid = parseInt(pid, 10) || process.pid;
  if (!__cpuusagecache[pid]) {
    __cpuusagecache[pid] = {
      'hit' : 0,
      'val' : 0,
      'per' : 0,
    };
  }
  __cpuusagecache[pid].hit = Date.now();

  return __cpuusagecache[pid].per;
};

module.exports = sysinfo;


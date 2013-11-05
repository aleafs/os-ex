/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */

"use strict";

var path = require('path');
var os = require('os');

var sysinfo = os;

(function Patch() {
  try {
    var $ = require(path.join(__dirname, os.platform(), 'info.js'));
    for (var i in $) {
      sysinfo[i] = $[i];
    }
  } catch (ex) {
    if ('MODULE_NOT_FOUND' !== ex.code) {
      throw ex;
    }
  }
})();

var __totalcpuusage = 0;

var getTotalCpuTime = function () {
  var all = 0;
  sysinfo.cpus().forEach(function (cpu) {
    if (!cpu.times) {
      return;
    }
    all += cpu.times.user - 0;
    all += cpu.times.nice - 0;
    all += cpu.times.idle - 0;
    all += cpu.times.sys - 0;
    all += cpu.times.irq - 0;
  });

  return all;
};

var getProcCpuTime  = function (pid) {
  var all = sysinfo.procstat(pid);
  if (!all || !all.pid) {
    return 0;
  }

  return all.utime + all.stime + all.cutime + all.cstime;
};

var __cpuusagecache = {};
setInterval(function () {

  __totalcpuusage = getTotalCpuTime();

  var ttl = Date.now() - 300000;
  for (var pid in __cpuusagecache) {
    if (__cpuusagecache[pid].hit < ttl) {
      delete __cpuusagecache[pid];
    } else {
      __cpuusagecache[pid].val = getProcCpuTime(pid);
    }
  }
}, 1000);

sysinfo.cpuusage = function (pid) {
  pid = parseInt(pid, 10) || process.pid;
  if (!(pid in __cpuusagecache)) {
    __cpuusagecache[pid] = {
      'hit' : 0,
      'val' : 0,
    };
  }
  __cpuusagecache[pid].hit = Date.now();

  var all = getTotalCpuTime();
  var now = getProcCpuTime(pid);

  return Math.round(100 * (now - __cpuusagecache[pid].val) / (all - __totalcpuusage));
};

module.exports = sysinfo;

/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */

"use strict";

var fs = require('fs');
var path = require('path');
var os = require('os');

var sysinfo = os;

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

  var all = getTotalCpuTime();
  var tmp = all - __totalcpuusage;

  if (tmp <= 0) {
    return;
  }

  var now = 0;
  var ttl = Date.now() - 300000;
  for (var pid in __cpuusagecache) {
    if (__cpuusagecache[pid].hit < ttl) {
      delete __cpuusagecache[pid];
      return;
    }

    now = getProcCpuTime(pid);
    __cpuusagecache[pid].per = Math.round(100 * (now - __cpuusagecache[pid].val) / tmp);
    __cpuusagecache[pid].val = now;
  }

  __totalcpuusage = all;

}, 1000);

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


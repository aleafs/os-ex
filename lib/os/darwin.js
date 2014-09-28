/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */

"use strict";

var os = require('os');

exports.procstat = function (pid) {
  return {};
};

exports.cputime = function () {
  var res = {
    'cpu' : {},
  };

  var sum = {};
  os.cpus().forEach(function (cpu, idx) {
    res['cpu' + idx] = cpu.times;
    for (var i in cpu.times) {
      if (!sum[i]) {
        sum[i] = 0;
      }
      sum[i] += cpu.times[i];
    }
  });
  res.cpu = sum;

  return res;
};

exports.netflowsize = function () {
  return {};
};

exports.meminfo = function () {
  var a = os.totalmem();
  var b = os.freemem();

  return {
    'total' : a,
    'free'  : b,
    'used'  : a - b,
  };
};


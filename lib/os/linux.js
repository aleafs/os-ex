/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */

"use strict";

var fs = require('fs');

exports.procstat = function (pid) {
  var res = {};
  try {
    var x = fs.readFileSync('/proc/' + pid + '/stat', 'utf8').match(/\S+/g);
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
        'cpu' : x[38] - 0,
      };
    }
  } catch (ex) {
  }

  return res;
};


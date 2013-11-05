/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */

"use strict";

var fs = require('fs');

exports.procstat = function (pid) {
  var res = {};
  try {
    var row = fs.readFileSync('/proc/' + pid + '/stat', 'utf8').split(' ');
    if (row && row.length >= 24) {
      res = {
        'pid' : row[0] - 0,
        'state' : row[2].trim(),
        'ppid'  : row[3] - 0,
        'utime' : row[13] - 0,
        'stime' : row[14] - 0,
        'cutime' : row[15] - 0,
        'cstime' : row[16] - 0,
        'vsize' : row[22] - 0,
        'rss' : row[23] - 0,
      };
    }
  } catch (ex) {
  }

  return res;
};


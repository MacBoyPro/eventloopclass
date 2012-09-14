var syscalls = require('syscalls');

var readables = {}; //{fd: callback}
var writeables = {}; //{fd: callback}

exports.on = function(fd, event, callback) {
  if(event == 'read') {
    readables[fd] = callback;
  } else {
    writeables[fd] = callback;
  }
};

exports.remove = function(fd, event) {
  if(event == 'read') {
    delete readables[fd];
  } else {
    delete writeables[fd];
  }
};

var timers = [];
var timer = 0;
exports.in = function(sec, callback) {
  timers.push({ timeout: timer + sec, callback: callback });
};

var nextTicks = [];
exports.nextTick= function(callback) {
  nextTicks.push(callback);
}

exports.run = function() {
  // Here is the event LOOP!
  while(true) {
    
    //call our nextTick functions
    for (var i = 0; i < nextTicks.length; i += 1) {
      nextTicks[i]();
    }

    nextTicks = [];

    if (Object.keys(readables).length == 0 && Object.keys(writeables).length == 0 && timers.length == 0) return;

    var fds = syscalls.select(Object.keys(readables), Object.keys(writeables), [], 1);
    
    timer += 1;
    for (var i = 0; i < timers.length; i += 1) {
      if(timers[i].timeout <= timer) {
        timers[i].callback();
        timers.splice(i, 1);
        i--;
      }
    }

  /* fds = [
      [readables],
      [writeables],
      [errors]
    ] */

   var readableFds = fds[0];
   var writeableFds = fds[1];

   for (var i = 0; i < readableFds.length; i += 1) {
     var fd = readableFds[i];
     var callback = readables[fd];
     callback();
   }

    for (var i = 0; i < writeableFds.length; i += 1) {
     var fd = writeableFds[i];
     var callback = writeables[fd];
     callback();
   }
  }
};

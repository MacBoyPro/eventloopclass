var syscalls = require('syscalls');

var userData = syscalls.read(0, 10);

syscalls.write(1, userData);

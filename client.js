var syscalls = require('syscalls');

var fd = syscalls.socket(syscalls.AF_INET, syscalls.SOCK_STREAM, 0);

syscalls.connect(fd, 3000, "0.0.0.0");

syscalls.write(fd, "Hi there server!\n");

var data = syscalls.read(fd, 1024);
console.log("Server said: " + data);

syscalls.close(fd);


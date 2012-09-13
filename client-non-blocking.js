var syscalls = require('syscalls');

var fd = syscalls.socket(syscalls.AF_INET, syscalls.SOCK_STREAM, 0);

syscalls.fcntl(fd, syscalls.F_SETFL, syscalls.O_NONBLOCK); //turning the file descriptor into a non-blocking socket

syscalls.connect(fd, 3000, "0.0.0.0");

syscalls.select([], [fd], [], 0);
syscalls.write(fd, "Hi there server!\n");

syscalls.select([fd], [], [], 0);
var data = syscalls.read(fd, 1024);
console.log("Server said: " + data);

syscalls.close(fd);



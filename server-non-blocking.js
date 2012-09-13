var syscalls = require('syscalls');

/* 
 * 1) domain, create a socket on IPV4 = AF_INET, IPV6 = AF_INET6
 * 2) tcp/udp type of socket, tcp = SOCK_STREAM, udp = SOCK_DGRAM
 * 3) version of the protocol, most of the time this is going to be zero
 *
 * fd (file descriptor - per process) will return the index for the I/O object and -1 if there 
 * is an error
 */

var fd = syscalls.socket(syscalls.AF_INET, syscalls.SOCK_STREAM, 0); 

//$ man 2 fcntl
syscalls.fcntl(fd, syscalls.F_SETFL, syscalls.O_NONBLOCK); //turning the file descriptor into a non-blocking socket

//socket, port, IP Address "wild card address" = 0.0.0.0
syscalls.bind(fd, 3000, "0.0.0.0");

//file descriptor of the socket, size of backlog - incoming connections waiting in the OS queue
syscalls.listen(fd, 100); //now listening for incoming connections

console.log('listing on port 3000');

var readables = {}; //{fd: callback}
var writeables = {}; //{fd: callback}



readables[fd] = function() {
  /*
   * 1) file descriptor for readability
   * 2) file descriptor for writeability
   * 3) file descriptor for error
   * 4) timeout
   */
  var connFd = syscalls.accept(fd); // accepting the incoming connection and returning a reference to the remote connection
  syscalls.fcntl(connFd, syscalls.F_SETFL, syscalls.O_NONBLOCK); //turning the file descriptor into a non-blocking socket
  console.log("Accepted new connection");

  readables[connFd] = function() {
    var data = syscalls.read(connFd, 1024); //read from remote connection
    console.log('Received: ' + data);
    delete readables[connFd];

    writeables[connFd] = function() {
      syscalls.write(connFd, "bye!\n"); //write to remote connection

      syscalls.close(connFd); //close remote connection
      delete writeables[connFd];
    }
  }
}

// Here is the event LOOP!
while(true) {
  var fds = syscalls.select(Object.keys(readables), Object.keys(writeables), [], 0);
  
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

syscalls.close(fd); // the OS will do this for us because it will cleanup after the process once it ends

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

//socket, port, IP Address "wild card address" = 0.0.0.0
syscalls.bind(fd, 3000, "0.0.0.0");

//file descriptor of the socket, size of backlog - incoming connections waiting in the OS queue
syscalls.listen(fd, 100); //now listening for incoming connections


while(true) {
  var connFd = syscalls.accept(fd); // accepting the incoming connection and returning a reference to the remote connection
  console.log("Accepted new connection");

  var data = syscalls.read(connFd, 1024); //read from remote connection
  console.log('Received: ' + data);

  syscalls.write(connFd, "bye!\n"); //write to remote connection

  syscalls.close(connFd); //close remote connection
}

syscalls.close(fd); // the OS will do this for us because it will cleanup after the process once it ends


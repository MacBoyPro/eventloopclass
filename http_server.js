var syscalls = require('syscalls');
var loop =require('./loop');
var HTTPParser = require('./http_parser').HTTPParser;

var HttpServer = function(callback) {
  var self = this;

  var fd = syscalls.socket(syscalls.AF_INET, syscalls.SOCK_STREAM, 0);
  syscalls.fcntl(fd, syscalls.F_SETFL, syscalls.O_NONBLOCK);
  syscalls.bind(fd, 3000, "0.0.0.0");
  syscalls.listen(fd, 100);

  self.start = function() {
    loop.on(fd, 'read', function() {
      var connFd = syscalls.accept(fd);
      syscalls.fcntl(connFd, syscalls.F_SETFL, syscalls.O_NONBLOCK);

      new HttpServer.Connection(connFd, callback);
    });
  }
};

HttpServer.Connection = function(fd, callback) {
  var parser = new HTTPParser(HTTPParser.REQUEST);

  loop.on(fd, 'read', function(){
    var data = syscalls.read(fd, 4096);
    parser.parse(data);
  });

  parser.onMessageComplete = function() {
    loop.remove(fd, 'read');
    process(parser.info);
  }

  function process(request) {
    // body...
    console.log(request);

    var responseBody = callback(request);
    var response = "HTTP/1.1 200 OK\r\n\
Content-Type: text/plain\r\n\
Content-Length: " + responseBody.length + "\r\n\
\r\n\
" + responseBody;

    sendMessage(response);
  }

  function sendMessage(data) {
    loop.on(fd, 'write', function(){
      syscalls.write(fd, data);
      console.log(data);
      syscalls.close(fd);
      loop.remove(fd, 'write');
    });
  }
}

var server = new HttpServer(function(request){
  return "you return " + request.url + "\n";
});

server.start();

loop.run();

var http = require('http');

// NOTE: We're now using Node.js builtin event loop. NOT the loop we built in loop.js


http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  
  if (req.url == "/slow") {
    var objects = [];
    var counter = 10000000;

    function compute() {
      objects.push(new Object);
      if(counter > 0) {
        process.nextTick(compute);
        counter--;
      }

      if (counter == 0) {
        res.end("slow request done, counter=" + counter + " objects=" + objects.length);
      }
    }

    compute();
  } else {
    res.end("fast request done");
    
  }
}).listen(3000);

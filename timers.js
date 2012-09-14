var loop = require('./loop');

loop.in(1, function(){
  console.log('this will print in 1 sec');
});

loop.in(2, function(){
  console.log('this will print in 2 sec');
});

loop.run();

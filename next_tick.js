//process.nextTick(function() {
  //console.log("will this run first ....");
//});

//console.log("or is this first?");
//

var loop = require('./loop');

loop.nextTick(function(){
  console.log('next tick');
});

console.log('before next tick');

loop.run();



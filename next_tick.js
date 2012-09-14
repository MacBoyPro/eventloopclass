process.nextTick(function() {
  console.log("will this run first ....");
});

console.log("or is this first?");

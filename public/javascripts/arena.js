importScripts("/javascripts/common.js");
// headings = 0 (up) 1 right 2 down 3 left
var update_world = function() {
  // Iterate over all objects to move them
  log("updating world");
};

var main_loop = function() {
  update_world();
  setTimeout(main_loop, 250);
}.bind(this);


var arena   = {
  'objects': []
};

this.onmessage = function (event) {
  var v = 0;
  var x = 1;

  var message = JSON.parse(event.data);
  switch (message.command) {
    case 'setup_world':
      arena.height = message.height;
      arena.width = message.width;
      // place the bots randomly
      for (var i = 0; i < message.bot_count; i++) {
        arena.objects.push({bot: i, dx:0, dy:0, heading: 0, x: Math.random()*arena.width , y:Math.random()*arena.height});
      }
      main_loop();
      break;
    case 'start' :
      // Update everyone initially with positions....
      // they can then give commands.
      break;
    case 'speed':
      // Move fwd or backwards (set your dx / dy)
      break;
    case 'turn':
      var dir = message.message;
      if (dir < 0 || dir > 4) {
        dir = 0;
      }
      objects[message.bot].heading = dir;
      break;
    case 'fire':
      break;
  }
};

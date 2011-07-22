importScripts("/javascripts/common.js");

//  Start up everything...
var bot_start = function(message) {
  log('define bot_start!');
};

// You got an updated state of the world... whatcha gonna do?
// message is a map array NxN
// elements are things on the map in a table with x,y
var bot_update = function(message) {
  log('define bot_update!');
 };

// -1 or 0 or +1 (rev, stop, fwd)
var set_speed = function(direction) {
  post({'command':'speed',
            'message':direction});
}.bind(this);

// is a number
//          0
//        3 T 1
//          2
var turn = function(new_direction) {
  post({'command':'turn',
            'message':new_direction});
}.bind(this);

// When you want to fire
var fire = function() {
  post(
      {'command':'fire',
       'message' : target_pos}
    );
}.bind(this);

onmessage = function (event) {
  var message = JSON.parse(event.data);
  switch (message.command) {
    case 'start':
      bot_start(message);
      break;
    case 'update':
      bot_update(message);
      break;
  };
};

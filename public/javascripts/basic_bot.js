var postJSON = function(obj) {
  postMessage(JSON.stringify(obj));
}
var console = {
  log: function(msg) {
    postJSON({command: 'log', 'message': msg});
  }
};
//  Start up everything...
var bot_start = function(message) {
  console.log('define bot_start!');
};

// You got an updated state of the world... whatcha gonna do?
// message is a map array NxN
// elements are things on the map in a table with x,y
var bot_update = function(message) {
  console.log('define bot_update!');
 };

// -1 or +1
var move_bot = function(direction) {
  postJSON({'command':'move',
            'direction':direction});
};

// is a {x,y} vector
//        0   1
//  -1 0    T    1 0
//        0  -1
var turn_bot = function(new_direction) {
  postJSON({'command':'turn',
            'direction':new_direction});
};

// When you want to fire--- just choose a point and fire!
// target_pos is an absolute position:  {x,y}
var fire_rocket = function(target_pos) {
  postJSON(
      {'command':'fire',
       'target' : target_pos}
    );
};

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

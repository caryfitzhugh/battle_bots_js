var postJSON = function(obj) {
  postMessage(JSON.stringify(obj));
};

var console = {
  log: function(msg) {
    postJSON({command: 'log', 'message': msg});
  }
};

var objects = [];
var arena = {};
var update_bot = function(index ) {
  postJSON($.extend(objects, {'bot':index}));
};

onmessage = function (event) {
  var message = JSON.parse(event.data);
  switch (message.command) {
    case 'setup_world':
      arena.height = message.height;
      arena.width = message.width;
      // place the bots randomly
      for (var i = 0; i < message.bot_count; i++) {
        objects.push({bot: i, dx:0, dy:0, x: Math.random()*arena.width , y:Math.random()*arena.height});
      }
      break;
    case 'start' :
      $.each(objects.bots, function( bot, index) {
        update_bot(index);
      });
      break;
    case 'move':
      bot_update(message);
      break;
    case 'turn':
      break;
    case 'fire':
      break;
  }
};

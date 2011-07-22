// Put your application scripts here
var Bot = {
  start: function(bot) {
    bot.postMessage(JSON.stringify({command: 'start'}));
  },
  update: function(bot, world) {
    bot.postMessage(JSON.stringify({command: 'update', world: ''}));
  }
};

var BattleBots = {
  bots: [],
  fight: function(bot_names) {

    // Setup arena / game world


    this.bots = $.map(bot_names, function(name, index) {
      var bot = new Worker("/bot/"+name);
      var log = function(msg) {
        console.log(name+"["+index+"]: "+msg);
      };

      bot.onmessage = function(evt) {
        var message = JSON.parse(evt.data);
        switch (message.command) {
          case 'log':
            log(message.message);
            break;
          case 'fire':
            log("firing");
            break;
          case 'turn':
            log("turning");
            break;
          case 'move':
            log("moving");
            break;
        }
      };
      Bot.start(bot);

      Bot.update(bot);
      return bot;
    });
  }
};

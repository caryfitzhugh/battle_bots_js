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


    this.bots = $.map(bot_names, function(name) {
      var bot = new Worker("/bot/"+name);

      console.log(name +": creating...");
      // Setup how bots talk back to us

      bot.onmessage = function(evt) {
        console.log(evt.data);
        // Redraw the map
      };
      Bot.start(bot);

      Bot.update(bot);
      return bot;
    });
  }
};

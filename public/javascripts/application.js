var BattleBots = {
  bots: [],
  fight: function(bot_names) {

    // Setup arena / game world
    this.arena = new Worker("/javascripts/arena.js");

    // Arena.
    // Pushes messages to the bots.
    // And
    this.arena.onmessage =  function (evt) {
      var message = JSON.parse(evt.data);
      var bot_cmd = function(cmd) {
        this.bots[cmd.index].postMessage( JSON.stringify(cmd));
      };

      if (message.command == 'log') {
        log(message.message);
      } else if (message.command == 'draw_map' ) {
        console.log('redraw map');
      } else {
        bot_cmd(message);
      }
    };

    this.bots = $.map(bot_names, function(name, index) {
      var bot = new Worker("/bot/"+name);
      var log = function(msg) {
        console.log(name+"["+index+"]: "+msg);
      };
      var cmd = function(cmd) {
        this.arena.postMessage( JSON.stringify($.extend(cmd, {bot: index })));
      };

      bot.onmessage = function(evt) {
        var message = JSON.parse(evt.data);
        if (message.command == 'log') {
          log(message.message);
        } else {
          cmd(message);
        }
      };
      return bot;
    });
console.log(this.bots.length);
    this.arena.postMessage(JSON.stringify({'command':'setup_world', 'width': 100, 'height':100, 'bot_count': this.bots.length}));
  }
};

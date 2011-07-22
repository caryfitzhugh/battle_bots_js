Worker.prototype.post = function(message) {
  str = JSON.stringify(message);
  this.postMessage(str);
};

var BattleBots = {
  bots: [],
  fight: function(bot_names) {
    this.arena = new Worker("/javascripts/arena.js");
    this.arena.onmessage =  function (evt) {
      var message = JSON.parse(evt.data);
      var bot_cmd = function(cmd) {
        this.bots[cmd.index].post( cmd);
      };

      var log = function(msg) {
        console.log("arena: "+msg);
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
        this.arena.post($.extend(cmd, {bot: index }));
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

    this.arena.post({'command':'setup_world', 'width': 100, 'height':100, 'bot_count': this.bots.length});
  }
};

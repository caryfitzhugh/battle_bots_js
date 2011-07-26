Object.prototype.keys = function ()
{
  var keys = [];
  for(var i in this) if (this.hasOwnProperty(i))
  {
    keys.push(i);
  }
  return keys;
}

var S4 = function () {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
};

var guid = function () {
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};

var params = { w: 20, h: 20 };

Worker.prototype.post = function(message) {
  this.postMessage(message);
};


var draw_map = function(message) {
  $('.obj').hide();
  $.each(message.message, function(uid,obj) {
    var display = $("."+uid);
    if (display.length === 0) {
      display = $("<div class=\"obj "+uid+"\">"+obj.type+"</div>");
      display.css({'position': 'absolute'});
      $('.battlefield').append(display);
    }
    display.css('top',  obj.y+"%");
    display.css('left', obj.x+"%");
    display.show();
  });
  $('.obj:hidden').remove();
};



var BattleBots = {
  fight: function(bot_names) {
    var bots = {};
    var arena = new Worker("/javascripts/arena.js");
    arena.onmessage =  function (evt) {
      var message = evt.data;
      var log = function(msg) {
        console.log("arena: "+msg);
      };

      if (message.command == 'log') {
        log(message.message);
      } else if (message.command == 'update' ) {
        draw_map(message);
        $.each(bots.keys(), function(index,guid) {
          bots[guid].post({'command':'update', me: message.message[guid],message: message.message});
        }.bind(this));
        // Send to each bot either ('you are now dead')
        // or it's visible state
      } else {
        console.log('what?');
      }
    }.bind(this);

    var arena = arena;

    $.map(bot_names, function(name) {
      var guid = window.guid();
      var bot = new Worker("/bot/"+name);
      var log = function(msg) {
        console.log(name+"["+guid+"]: "+msg);
      };
      bot.onmessage = function(evt) {
        var msg = evt.data;
        if (msg.command == 'log') {
          log(msg.message);
        } else {
          if (!bots[guid]) {
            bots[guid] = bot;
          }
          msg.uid = guid;
          arena.post(msg);
        }
      }.bind(this);

      bot.post({'command':'startup'});
    });

    arena.post({'command':'setup_world', 'width': params.w, 'height':params.h});
  }
};

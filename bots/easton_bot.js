importScripts("/javascripts/basic_bot.js");

var my_fire = function() {
  log('I will defeat you with ONE punch!');
  bot.fire();
};

bot.update = function(message) {
  var my_pos = message.me;
  if (my_pos) {
    if (my_pos.speed === 0) {
      bot.turn(-1);
      bot.set_speed(1);
      my_fire();
    }

  } else {
    log("Argh. I don't like this!");

  }
}.bind(this);

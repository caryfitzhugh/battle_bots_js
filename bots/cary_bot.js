importScripts("/javascripts/basic_bot.js");

bot.update = function(message) {
  var my_pos = message.me;
  if (my_pos) {
    if (my_pos.speed === 0) {
      bot.turn(1);
      bot.set_speed(1);
    }
  } else {
    log("Darn. I'm Dead!");
  }
}.bind(this);

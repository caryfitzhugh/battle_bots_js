importScripts("/javascripts/basic_bot.js");

bot.update = function(me, message) {
  if (me.speed === 0) {
    bot.turn(1);
    bot.set_speed(1);
    bot.fire();
  }
  if (me.shots === 0) {
    bot.set_speed(0);
  }
  if (me.shots === 5) {
    bot.set_speed(-1);
    bot.fire();
  }
}.bind(this);

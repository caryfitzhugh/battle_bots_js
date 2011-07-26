importScripts("/javascripts/basic_bot.js");

var my_fire = function() {
  bot.taunt('I will defeat you with ONE punch!');
  bot.fire();
};

bot.update = function(me, message) {
  if (me) {
    if (me.speed === 0) {
      bot.turn(-1);
      bot.set_speed(1);
      my_fire();
    }
  }
}.bind(this);

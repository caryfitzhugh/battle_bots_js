importScripts("/javascripts/common.js");
importScripts("/javascripts/worker_commands.js");
importScripts("/javascripts/basic_bot_commands.js");

onmessage = function (event) {
  var message = event.data;
  switch (message.command) {
    case 'startup':
      bot.join_arena();
      bot.start();
      break;
    case 'update':
      bot.update(message);
      break;
  }
}.bind(this);

var bot = {
  bot_initialization_parameters : {
    'image_url': "http://www-personal.umich.edu/~bazald/l/tutorial/zenitank/tank.png"
  },
  join_arena: function(extra_params) {
    extra_params = extra_params || {};
    worker.command('join', this.bot_initialization_parameters);
  },
  start: function(message) {
    log('define bot_start!');
  },
  update: function(message) {
    log('define bot_update!');
  },
  // -1 or 0 or +1 (rev, stop, fwd)
  set_speed: function(d) {
    worker.command('speed', d);
  },
  // is a delta..  -1 is left, +1 is right
  //          0
  //        3 T 1
  //          2
  turn:  function(d) {
    worker.command('turn', d);

  },
  fire: function() {
    worker.command('fire');
  }
};

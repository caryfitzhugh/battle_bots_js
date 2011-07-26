var bot = {
  alive: true,
  bot_initialization_parameters : {
    'image_url': "http://www-personal.umich.edu/~bazald/l/tutorial/zenitank/tank.png"
  },
  taunt: function(msg) {
    worker.command('taunt', msg);
  },
  join_arena: function(extra_params) {
    extra_params = extra_params || {};
    worker.command('join', this.bot_initialization_parameters);
  },
  start: function(message) {
    log('define bot_start!');
  },
  _im_dead: function(message) {
    this.alive = false;
    this.im_dead(message);
  },
  im_dead: function(message) {
    log("I am dead");
  },
  _update: function(message) {
    if (!message.me && this.alive) {
      this._im_dead(message);
    } else if (message.me) {
      this.update(message.me, message);
    }
  },
  update: function(me, message) {
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

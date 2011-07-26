importScripts("/javascripts/common.js");
importScripts("/javascripts/underscore.js");

var arena   = {
  'objects': {}
};

// headings = 0 (up) 1 right 2 down 3 left
//        0      1      2      3
// dx =   0      1      0      -1
// dy =   1      0      -1     0
var dxdy = function(heading) {
  return { 0: { dx: 0, dy: 1},
           1: { dx: 1, dy: 0},
           2: { dx: 0, dy: -1},
           3: { dx: -1, dy: 0}
        }[heading];
};

var add_object = function(positions, object) {
  positions[object.x] = positions[object.x] || {};
  positions[object.x][object.y] = positions[object.x][object.y] || [];
  positions[object.x][object.y].push(object);
  return positions;
};

var move = function(obj, direction) {
  direction = direction || 1;
  var vel = dxdy(obj.heading);
  obj.last_x = obj.x;
  obj.last_y = obj.y;
  obj.x = obj.x + vel.dx * obj.speed * direction;
  obj.y = obj.y + vel.dy * obj.speed * direction;

  return obj;
};

var scope_for_wrecks = function( objs, wrecks ) {
  if (wrecks.length === 0) {
    return objs;
  }

  objs = _.map(objs, function(bot) {
    var bots = _.map(wrecks, function(wreck) {
      if ((bot.x == wreck.x) && (bot.y == wreck.y)) {
        return null;
      } else {
        return bot;
      }
    });
    bots = _.select(bots, function(bot) { return !!bot; });
    if (bots.length === 0) {
      return null;
    } else {
      return bot;
    }
  });
  objs = _.select(objs, function(bot) { return !!bot; });
  return objs;
}.bind(this);

var normalize_wrecks = function(wrecks) {
  var map = {};
  _.each(wrecks, function(wreck) {
    map[""+wreck.x+"-"+wreck.y] = wreck;
  });
  return _.map(map, function(k, v){ return k; });
};
var check_for_collisions = function(positions) {
  // Check for collisions
  _.each(positions, function(x) {
    _.each(positions, function(y) {
      _.each(y, function( vals) {
        if (vals.length > 1) {
          var wreck = vals[0];
          wreck.speed = 0;
          wreck.type = 'wreck';
          arena.wrecks.push(wreck);
          _.each(vals, function(obj) {
            obj.speed = 0;
          });
        }
      });
    });
  });
};

var move_objects = function(objects) {
  var new_state = {};
  // Move things.
  _.each(objects, function(obj) {
    move(obj);
  });

  return objects;
}.bind(this);

var check_for_collisions = function(objects) {
  var delete_bullet_guids = [];
  _.each(objects, function(obj1, guid1) {
    _.each(objects, function(obj2, guid2) {
      if (obj1 != obj2) {
        if ((obj1.last_x == obj2.x && obj1.last_y == obj2.y &&
             obj1.x == obj2.last_x && obj1.y == obj2.last_y) ||
            (obj1.x == obj2.x && obj1.y == obj2.y)) {
          // Only take care of obj1, obj2 is taken care of on the inverse case
          if (obj1.type == 'bullet') {
            delete_bullet_guids.push(obj1.uid);
          } else if (obj1.type == 'bot' ) {
            obj1.type = 'wreck';
            obj1.speed = 0;
            obj1.shots = 0;
            obj1.x = obj2.x;
            obj1.y = obj2.y;
          }
        }
      }
    });
  });

  // Delete all the bullet UIDS
  _.each(delete_bullet_guids, function(uid) {
    delete objects[uid];
  });

  return objects;
}.bind(this);

var stop_bots_off_edge = function(objects) {
  _.each(objects, function(obj,guid) {
log(JSON.stringify(obj));
    if (obj.x < 0 || obj.x >= arena.width ||
        obj.y < 0 || obj.y >= arena.height &&
        obj.type == 'bot') {
      // Back up the bot
      obj = move(obj, -1);
      // Set speed to 0
      obj.speed = 0;
    }
  });
  return objects;
}.bind(this);

var remove_bullets_off_edge = function(objects) {
  _.each(objects, function(obj,guid) {
    if (obj.x < 0 || obj.x >= arena.width ||
        obj.y < 0 || obj.y >= arena.height &&
        obj.type == 'bullet') {
      delete objects[guid];
    }
  });
  return objects;
}.bind(this);

var main_loop = function() {
  arena.objects = move_objects(arena.objects);
  arena.objects = remove_bullets_off_edge(arena.objects);
  arena.objects = stop_bots_off_edge(arena.objects);
  arena.objects = check_for_collisions(arena.objects);

  post({command:'update', message: arena.objects});
  setTimeout(main_loop, 250);
}.bind(this);

this.onmessage = function (event) {
  var v = 0;
  var x = 1;
  var message = event.data;

  switch (message.command) {
    case 'setup_world':
      arena.height = message.height;
      arena.width = message.width;
      main_loop();
      break;
    case 'join' :
      var bot_guid = message.uid;
      arena.objects[bot_guid] = {type: 'bot', uid: bot_guid, shots: 5, speed: 1, heading: 0, x: Math.floor(Math.random()*arena.width) , y:Math.floor(Math.random()*arena.height)};
      arena.objects[bot_guid] = move(arena.objects[bot_guid]);
      log("Bot " + bot_guid + " joined");
      break;
    case 'speed':
      // Move fwd or backwards (set your dx / dy)
      arena.bots[message.bot_uid].speed = message.message;
      break;
    case 'turn':
      var dir = message.message;
      var bot = arena.bots[message.bot_uid];
      var new_dir = dir + bot.heading;

      if (new_dir < 0){
        new_dir = 3;
      } else if (new_dir > 3) {
        new_dir = 0;
      }

      arena.bots[message.bot_uid].heading = new_dir;
      break;
    case 'fire':
      var bot_guid = message.uid;
      var bot = arena.objects[bot_guid];

      log("Bot " + bot_guid + " firing");
      if (bot.shots > 0) {
        var uid = guid();
        bot.shots -= 1;
        var bullet = {uid: uid, type:'bullet', speed: 1, heading: bot.heading, x: bot.x, y: bot.y};
        bullet = move(bullet);
        arena.objects[uid] = bullet;
      } else {
        log("Bot " + bot_guid + " misfired -- no ammo");
      }
      break;
  }
};

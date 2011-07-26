importScripts("/javascripts/common.js");
importScripts("/javascripts/underscore.js");

var arena   = {
  'objects': {},
  max_shots: 2,
  reload_shot_time: 5
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

var move = function(obj, direction) {
  direction = direction || 1;
  var vel = dxdy(obj.heading);
  obj.last_x = obj.x;
  obj.last_y = obj.y;
  obj.x = obj.x + vel.dx * obj.speed * direction;
  obj.y = obj.y + vel.dy * obj.speed * direction;

  return obj;
};

var move_objects = function(objects) {
  // Move things.
  _.each(objects, function(obj) {
    if (obj.type != 'wreck') {
      move(obj);
    }
  });

  return objects;
}.bind(this);

var regen_bots = function(objects) {
  _.each(objects, function(obj) {
    if (obj.type == 'bot') {
      if (obj.speed === 0) {
        obj.reloading_counter = obj.reloading_counter || 0;
        obj.reloading_counter += 1;
        if (obj.reloading_counter > arena.reload_shot_time && obj.shots < arena.max_shots) {
          obj.shots += 1;
          //log('bot: ' + obj.uid + ' reloaded 1 shot');
          obj.reloading_counter = 0;
        }
      } else {
        obj.reloading_counter = 0;
      }
    }
  });
  return objects;
};
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
    if ((obj.x < 0 || obj.x >= arena.width ||
        obj.y < 0 || obj.y >= arena.height) &&
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
    if ((obj.x < 0 || obj.x >= arena.width ||
        obj.y < 0 || obj.y >= arena.height) &&
        obj.type == 'bullet') {
      delete objects[guid];
    }
  });
  return objects;
}.bind(this);

var main_loop = function() {
  arena.objects = move_objects(arena.objects);
  arena.objects = remove_bullets_off_edge(arena.objects);
  arena.objects = regen_bots(arena.objects);
  arena.objects = stop_bots_off_edge(arena.objects);
  arena.objects = check_for_collisions(arena.objects);
  post({command:'update', message: arena.objects});
  _.each(arena.objects, function(object, guid) {
    object.taunts = [];
  });
  setTimeout(main_loop, 1000);

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
      arena.objects[bot_guid] = _.extend(message.message, {type: 'bot', uid: bot_guid, shots: arena.max_shots, speed: 1, heading: 0, x: Math.floor(Math.random()*arena.width) , y:Math.floor(Math.random()*arena.height), taunts:[]});
      arena.objects[bot_guid] = move(arena.objects[bot_guid]);
      log("Bot " + bot_guid + " joined");
      break;
    case 'taunt' :
      var bot_guid = message.uid;
      arena.objects[bot_guid].taunts.push(message.message);
      break;
    case 'speed':
      // Move fwd or backwards (set your dx / dy)
      var bot = arena.objects[message.uid];
      var speed = message.message;
      switch(speed) {
        case -1:
        case 0:
        case 1:
          bot.speed = speed;
          break;
        default:
          bot.speed = 0;
      }
      //log("Bot " + bot.uid + " changing speed");
      break;
    case 'turn':
      var bot = arena.objects[message.uid];
      var dir = message.message;
      var new_dir = dir + bot.heading;

      if (new_dir < 0){
        new_dir = 3;
      } else if (new_dir > 3) {
        new_dir = 0;
      }

      //log("Bot " + bot.uid + " turning");
      arena.objects[message.uid].heading = new_dir;
      break;
    case 'fire':
      var bot = arena.objects[message.uid];

      //log("Bot " + bot.uid + " firing");
      if (bot.shots > 0) {
        var uid = guid();
        bot.shots -= 1;
        var bullet = {image_url: 'http://cdn1.iconfinder.com/data/icons/momenticons-gloss-basic/momenticons-gloss-basic/32/bullet-black.png',
                      uid: uid, type:'bullet', speed: 1, heading: bot.heading, x: bot.x, y: bot.y};
        bullet = move(bullet);
        arena.objects[uid] = bullet;
      } else {
        //log("Bot " + bot.uid + " misfired -- no ammo");
      }
      break;
  }
};

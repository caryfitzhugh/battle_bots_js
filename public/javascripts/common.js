
var S4 = function () {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
};

var guid = function () {
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};
Function.prototype.bind = function(obj) {
  var method = this,
  temp = function() {
    return method.apply(obj, arguments);
  };
  return temp;
}

Object.prototype.keys = function ()
{
  var keys = [];
  for(var i in this) {
    if (this.hasOwnProperty(i)) {
      keys.push(i);
    }
  }
  return keys;
}

var post = function(obj) {
  postMessage(obj);
}.bind(this);

var log =  function(msg) {
  post({command: 'log', 'message': msg});
}.bind(this);

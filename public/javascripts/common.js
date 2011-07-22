Function.prototype.bind = function(obj) {
  var method = this,
  temp = function() {
    return method.apply(obj, arguments);
  };
  return temp;
}

var post = function(obj) {
  postMessage(JSON.stringify(obj));
}.bind(this);

var log =  function(msg) {
  post({command: 'log', 'message': msg});
}.bind(this);

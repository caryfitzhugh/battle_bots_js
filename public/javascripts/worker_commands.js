var worker ={
  command: function(cmd_str, data) {
    var msg = {command: cmd_str, message: data};
    postMessage(msg);
  }
};

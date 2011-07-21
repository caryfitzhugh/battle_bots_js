onmessage = function (event) {
  var message = JSON.parse(event.data);
  switch (message.command) {
    case 'start': 
      postMessage("Starting...");
      break;
    case 'update': 
      postMessage('Here is my move based on the world');
      break;
  };
};

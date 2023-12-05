const WebSocket = require('ws');

let clientName = process.argv[2];

const ws = new WebSocket('ws://localhost:4000');

ws.on('open', () => {
  let message = {
    client: clientName,
    timestamp: Date.now()
  };
  ws.send(JSON.stringify(message));
});

ws.on('message', (message) => {
  console.log('Received: ' + message);
});

const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:4000');

ws.on('message', (message) => {
  console.log('Received: ' + message);
});

ws.on('pong', () => {
  console.log('Received pong');
});

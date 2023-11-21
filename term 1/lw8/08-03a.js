const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:4000');

ws.on('open', () => {
  ws.send('Hello from 08-03a client');
});

ws.on('message', (message) => {
  console.log('Received: ' + message);
});
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 4000 });
let count = 0;

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    let data = JSON.parse(message);
    let response = {
      server: count++,
      client: data.client,
      timestamp: data.timestamp
    };
    console.log('Received: ' + message);
    ws.send(JSON.stringify(response));
  });
});

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 4000 });
let count = 0;

setInterval(() => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send('09-03-server: ' + count++);
    }
  });
}, 15000);

setInterval(() => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.ping(() => {});
    }
  });
  console.log(`Number of connections: ${wss.clients.size}`);
}, 5000);

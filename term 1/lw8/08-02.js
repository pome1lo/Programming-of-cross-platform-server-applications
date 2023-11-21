const WebSocket = require('ws');

let count = 0;
const ws = new WebSocket('ws://localhost:4000');

ws.on('open', () => {
  let intervalId = setInterval(() => {
    ws.send('08-02-client: ' + count++);
  }, 3000);
  setTimeout(() => {
    clearInterval(intervalId);
    ws.close();
  }, 25000);
});

ws.on('message', (message) => {
  console.log('Received: ' + message);
});

const http = require('http');
const WebSocket = require('ws');

// HTTP server
const server = http.createServer((req, res) => {
  if (req.url === '/start' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
        <body>
          <h1>08-01</h1>
          <button onclick="startWS()">Start WS</button>
          <div id="messages"></div>
          <script>
            let ws;
            let count = 0;
            let intervalId;
            function startWS() {
              ws = new WebSocket('ws://localhost:4000');
              ws.onopen = () => {
                intervalId = setInterval(() => {
                  ws.send('08-01-client: ' + count++);
                }, 3000);
                setTimeout(() => {
                  clearInterval(intervalId);
                  ws.close();
                }, 25000);
              };
              ws.onmessage = (event) => {
                document.getElementById('messages').innerText += event.data + '\\n';
              };
            }
          </script>
        </body>
      </html>
    `);
  } else {
    res.writeHead(400);
    res.end();
  }
});
server.listen(3000);

// WebSocket server
const wss = new WebSocket.Server({ port: 4000 });
wss.on('connection', (ws) => {
  let count = 0;
  let lastClientMsg = '';
  ws.on('message', (message) => {
    console.log('Received: ' + message);
    let strMessage = message.toString();
    lastClientMsg = strMessage.split(' ')[1];
  });
  setInterval(() => {
    ws.send('08-01-server: ' + lastClientMsg + '->' + count++);
  }, 5000);
});
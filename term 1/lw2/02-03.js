const http = require('http');

http.createServer(function (req, res) {
    if (req.url === '/api/name') {
        const name = 'Puzikov Alexey';
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(name);
        res.end();
    }
}).listen(5000);

console.log('Server running at http://localhost:5000/api/name');
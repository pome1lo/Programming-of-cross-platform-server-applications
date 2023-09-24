const http = require('http');
const fs = require('fs');

http.createServer(function (req, res) {
  if (req.url === '/png') {
    fs.readFile('pic.png', function(err, data) {
        if (err) {
            res.writeHead(404);
            res.write('File not found!');
        } else {
            res.writeHead(200, {'Content-Type': 'image/png'});
            res.write(data);
        }
        res.end();
    });
  }
}).listen(5000);

console.log('Server running at http://localhost:5000/png');
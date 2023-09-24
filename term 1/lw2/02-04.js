const http = require('http');
const fs = require('fs');

http.createServer(function (req, res) {
    if (req.url === '/xmlhttprequest') {
        fs.readFile('xmlhttprequest.html', function(err, data) {
            if (err) {
                res.writeHead(404);
                res.write('File not found!')
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
            }
            res.end();
        });
    }
    if (req.url === '/api/name') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('<h1>Puzikov Alexey</h1>\n');
    }
}).listen(5000);

console.log('Server running at http://localhost:5000/xmlhttprequest');
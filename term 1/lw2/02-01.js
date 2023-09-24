const http = require('http');
const fs = require('fs');

http.createServer(function (request, response) {
	response.writeHead(200, {'Content-Type': 'text/html'});

    if (request.url === '/html') {
        fs.readFile('./index.html', function(err, data) {
            if (err) {
                response.writeHead(404);
                response.write('File not found!');
            } else {
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.write(data);
            }
            response.end();
        });
    }
}).listen(5000);

console.log('Server running at http://localhost:5000/html');
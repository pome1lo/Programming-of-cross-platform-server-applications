http = require('http');
url = require('url');
fs = require('fs');
database = require('./Modules/DB');

var db = new database.DB();

db.on('GET', (req, res) => { 
    res.end(JSON.stringify(db.select()));
});

db.on('POST', (req, res) => {
    req.on('data', data => {
        let r = JSON.parse(data);
        console.log(r);
        db.insert(r);
        res.end(JSON.stringify(r));
    });
});

db.on('PUT', (req, res) => {
    req.on('data', data => {
        let r = JSON.parse(data);
        console.log(r);
        db.update(r);
        res.end(JSON.stringify(r));
        });
});

db.on('DELETE', (req, res) => {
    req.on('data',data=>{
        let s = JSON.parse(data);
        let k= db.delete(s.id);
        res.end(JSON.stringify(k));
    });
});

http.createServer(function (request, response) {
    if(url.parse(request.url).pathname === '/api/db') {
        db.emit(request.method, request, response);
    }
    if(url.parse(request.url).pathname === '/') {
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end(fs.readFileSync('./04-02.html'));
    }
}).listen(5000, () => 
    console.log('Server is running at http://localhost:5000')
);
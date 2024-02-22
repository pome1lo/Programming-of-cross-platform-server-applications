const Pulpit = require('./models/Pulpit');
const Auditorium = require('./models/Auditorium');
const AuditoriumType = require('./models/AuditoriumType');
const Faculty = require('./models/Faculty');
const Subject = require('./models/Subject');
const Teacher = require('./models/Teacher');
var http = require('http');

const GET = require('./handlers/get');  
const POST = require('./handlers/post');  
const PUT = require('./handlers/put');  
const DELETE = require('./handlers/delete');  
const OTHER = require('./handlers/other');  

let http_handler = (req, res) => {
    res.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8"
    })
    console.log(req.method, " - ", req.url);
    switch (req.method) {
        case "GET": GET(req, res); break;
        case "POST": POST(req, res); break;
        case "PUT": PUT(req, res); break;
        case "DELETE": DELETE(req, res); break;
        default: OTHER(req, res); break;
    }
}

let server = http.createServer();
let serverAdress = "http://localhost:3000";

server.listen(3000, (v) => {
    console.log(serverAdress);
}).on('error', (e) => {
    console.log(serverAdress + "error: ", e);
}).on('request', http_handler);


Auditorium.scope('MyScope').findAll()
  .then(auditoriums => {
    console.log(auditoriums);
  })
  .catch(err => {
    console.error(err);
  });


  
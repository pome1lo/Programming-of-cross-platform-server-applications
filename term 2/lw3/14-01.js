var http = require('http');
var fs = require('fs');
const url = require('url');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
 
const POST = require("./handlers/post");
const PUT = require("./handlers/put");
const DELETE = require("./handlers/delete");
const GET = require("./handlers/get");

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
        default: OTHER_handler(req, res); break;
    }
}

let server = http.createServer();

server.listen(3000, (v) => {
    console.log("http://localhost:3000/");
}).on('error', (e) => {
    console.log("http://localhost:3000/ error: ", e);
}).on('request', http_handler);


async function runTransaction() {
    const transaction = await prisma.$transaction([
        prisma.AUDITORIUM.updateMany({
            data: {
                AUDITORIUM_CAPACITY: {
                    increment: 100,
                },
            },
        }),
    ]);
    console.log('Changes applied:', transaction);

    console.log('Rolling back changes...');
    await prisma.$transaction([]);

    console.log('Transaction rolled back.');
}

runTransaction()
  .catch((error) => {
    console.error('Error during transaction:', error);
})
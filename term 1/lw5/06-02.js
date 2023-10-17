const http = require("http");
const url = require("url");
const fs = require("fs");
const { parse } = require("querystring");
const nodemailer = require("nodemailer");
const send = require("./m06_PAA");

const server = http.createServer().listen(5000);
console.log("http://localhost:5000/");

server.on("request", (req, res) => {
    const path = url.parse(req.url).pathname;

    if (path === "/" && req.method === "GET") {
        fs.readFile("06-02.html", (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        });
    }
});
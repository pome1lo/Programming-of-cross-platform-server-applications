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
    } else if (path === "/" && req.method === "POST") {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {
            let params = parse(body);

            send.send(params.sender, params.password, params.receiver, params.message)
              .then(response => console.log(`Письмо успешно отправлено: ${response}`))
              .catch(error => console.log(`Ошибка при отправке письма: ${error}`));
            
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(`<h1>${params.message}</h1>`);
        });
    }
});
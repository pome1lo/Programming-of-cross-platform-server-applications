let http = require('http');
let fs = require('fs');
let path = require('path');
let url = require('url');
// let m07_01 = require('./m07-01')('./static');

let server = http.createServer((req, res) => {
    let path1 = url.parse(req.url).pathname;
    console.log(path1);
    switch (req.method) {
        case 'GET': {
            switch (url.parse(req.url).pathname) {
                case '/': {
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                    res.write(fs.readFileSync('./index.html'));
                    res.end();
                    break;
                }

                case '/connection': {
                    res.write(`KeepAliveTimeout: ${server.keepAliveTimeout}`);
                    
                    let set = Number(url.parse(req.url, true).query.set);
                    if (Number.isInteger(set)) {
                        server.keepAliveTimeout = set;
                        res.write(`\nУстановлено новое значение параметра KeepAliveTimeout: ${server.keepAliveTimeout}`);
                    }
                    
                    res.end();
                    break;
                }

                case '/headers': {
                    res.setHeader('CustomHeader', '69');
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.write(`<h3>request headers: ${JSON.stringify(req.headers)} </h3>`);
                    res.write(`<h3>resuest headers: ${JSON.stringify(res.getHeaders())}<h1>`);
                    res.end();
                    break;
                }
                
                case '/parameter': {
                    let x = parseInt(url.parse(req.url, true).query.x);
                    let y = parseInt(url.parse(req.url, true).query.y);
                    if (Number.isInteger(x) && Number.isInteger(y)) {
                        res.end('x + y = ' + (x + y) + '\nx - y = ' + (x - y) +
                              '\nx * y = ' + (x * y) + '\nx / y = ' + (x / y));
                    } else {
                        res.end('Error: values are not integers')
                    }
                    break;
                }

                case '/socket': {
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                    res.write(`<h3>IP Address Client = ${req.socket.remoteAddress}</h3>`);
                    res.write(`<h3>Client Port = ${req.socket.remotePort}</h3>`);
                    res.write(`<h3>IP Address Server =  ${req.socket.localAddress}</h3>`);
                    res.write(`<h3>Server Port = ${req.socket.localPort}</h3>`);
                    res.end();
                    break;
                }
                
                case '/resp-status': {
                    let statusCode = parseInt(url.parse(req.url, true).query.code);
                    let mess = url.parse(req.url, true).query.mess;
                    res.setHeader('Content-Type', 'text/html; charset=utf-8');

                    res.statusCode = statusCode;
                    res.statusMessage = mess;
                    res.write(`status code: ${res.statusCode}, status message: ${res.statusMessage}`);
                    res.end();
                    break;
                }

                case '/files': {
                    fs.readdir("./static", (err, files) => {
                        res.setHeader("X-static-files-count", files.length);
                        res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
                        res.end(`${files.length}`);
                    });
                    break;
                }

                case '/upload': {
                    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
                    res.end(fs.readFileSync("uploadForm.html"));
                    break;
                }
            }
        }
        case 'POST': {
            switch (url.parse(req.url).pathname) {
                case '/formparameter': {
                    res.write(fs.readFileSync('./formparameter.html'));
                    res.end();
                    break;
                }

                case '/json': {
                    let jsonData = "";
                    req.on("data", data => {
                        jsonData += data;
                    });
                    req.on("end", () => {
                        let result = JSON.parse(jsonData);
                        let comment = "Ответ";
                        let sum = result.x + result.y;
                        let concat = `${result.s}: ${result.o.surname}, ${result.o.name}`;
                        let length = result.m.length;
                        res.writeHead(200, {"Content-Type": "text/json; charset=utf-8"});
                        res.end(JSON.stringify(
                            {
                                "__comment": comment,
                                "x_plus_y": sum,
                                "Concatination_s_o": concat,
                                "Length_m": length
                            }
                        ));
                    });
                    break;
                }

                case '/xml': {
                    let xmltxt = "";
                    req.on("data", data => {
                        xmltxt += data;
                    });
                    req.on("end", () => {
                        parseString(xmltxt, (err, result) => {
                            if (err) res.end("bad xml");
                            else {
                                res.writeHead(200, {"Content-Type": "text/xml; charset=utf-8"});
                                res.end(xmlbuild(result));
                            }
                        });
                    });
                    break;
                }

                case '/upload': {
                    let form = new mp.Form({uploadDir: "./static"});
                    form.on("field", (name, value) => {
                    });
                    form.on("file", (name, file) => {
                    });

                    form.on("error", (err) => {
                        res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
                        res.end(`${err}`);
                    });

                    form.on("close", () => {
                        res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
                        res.end("Файл получен");
                    });

                    form.parse(req);
                    break;
                }
            }
        }
    }
        
});

server.listen(5000, () => {
    console.log('Server running at http://localhost:5000/')
});
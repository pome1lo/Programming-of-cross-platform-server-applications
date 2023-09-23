let start = '<html><head><style type="text/css" id="operaUserStyle"></style><style type="text/css"></style></head><body>';
let end = '</body></html>';

var http = require('http');

let h = (r) => {
    let rc = '';
    for (key in r.headers) {
        rc += '<h3>' + key + ': ' + r.headers[key] + '</h3>';
    }
    return rc;
}

http.createServer(function (request, response) {
    let b = '';

    request.on('data', str => {
        b += str;
        console.log('data', b);
    });

    response.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8;'
    });

    request.on('end', () => response.end(start +
        '<h1>Структура запроса</h1>' +
        `<h2> Метод: ${request.method}<h2>` +
        `<h2> Url: ${request.url}<h2>` +
        `<h2> Версия: ${request.httpVersion}<h2>` +
        '<h1>Заголовки</h1>' +
        `<h2>${h(request)}<h2>` +
        `<h1>Тело ${b}</h1>` + end
    ));
}).listen(3000);

console.log('Server running at htpp://localhost:3000/');
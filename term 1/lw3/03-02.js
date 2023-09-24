// const express = require('express');
// const app = express();

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     next();
//   });

// function factorial(n) {
//     if (n === 0 || n === 1) {
//         return 1;
//     } else {
//         return n * factorial(n - 1);
//     }
// }

// app.get('/fact', (req, res) => {
//     const k = parseInt(req.query.k);
//     const fact = factorial(k);
//     res.json({ k, fact });
// });

// app.get('/factList', (req, res) => {
//     const max = parseInt(req.query.max);
//     let result = [];
//     for (let i = 0; i < max; i++) {
//         const start = performance.now();
//         const fact = factorial(i);
//         const end = performance.now(); 
//         result[i] = `\n${i}. Result: ${((end - start) * 10000).toFixed(2)}-${i}/${fact}`;
//     }
//     res.end(result.toString());
// });


// app.listen(5000, () => {
//     console.log('Server is running on port http://localhost:5000');
//     console.log('test link http://localhost:5000/fact?k=3');
//     console.log('test link file:///D:/FILES/University/3%20course/1%20term/PSCP/lw3/03-03.html');
// });





http = require('http');
url = require('url');

let factorial = (n) => {
    if (n === 0 || n === 1) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
};

http.createServer((req, res) => {
    let path = url.parse(req.url).pathname;
    if (path === '/fact') {
        let param = url.parse(req.url, true).query.k;
        if (typeof param !== 'undefined') {
            let k = parseInt(param, 10);
            if (Number.isInteger(k)) {
                res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                res.end(JSON.stringify({k: k, fact: factorial(k)}))
            }
        }
    } else {
        res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
        res.end('<h1>404</h1>')
    }
}).listen(5000, () => console.log('Server is running at http://localhost:5000'));
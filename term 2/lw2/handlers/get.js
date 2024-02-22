const sequelize = require('../config');
var fs = require('fs');

let GET = (req, res) => {
    var parseUrl = require('url').parse(req.url);

    if (parseUrl.pathname.includes("/api/")) {
        var table = parseUrl.pathname.replace("/api/", "");
        console.log("table: " + table);

        sequelize.query(`SELECT * FROM ${table}`, { type: sequelize.QueryTypes.SELECT})
        .then(result => {
            console.log(result);
            res.end(JSON.stringify(result));
        })
        .catch(err => {
            res.end(JSON.stringify({
                code: 1,
                message: `row not select from table ${table} `
            }));
        });
    } else if (parseUrl.pathname === '/') {
        let html = fs.readFileSync('index.html');
        res.writeHead(200, {
            'Content-Type' : 'text/html;charset=utf-8'
        });
        res.end(html);
    }

    console.log(parseUrl);
}

module.exports = GET;
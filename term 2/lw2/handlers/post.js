const sequelize = require('../config');

let POST = (req, res) => {
    var parseUrl = require('url').parse(req.url);

    var insertedObject = '';

    if (parseUrl.pathname.includes("/api/")) {
        var table = parseUrl.pathname.replace("/api/", "");
        console.log("table: " + table);

        req.on('data', (data) => {
            insertedObject += data;
        });
        req.on('end', () => {
            try {
                let obj = JSON.parse(insertedObject);
                console.log(obj);

                
                const Model = sequelize.models[table];

                if(Model) {
                    Model.create(obj)
                    .then(result => {
                        console.log("Inserted");
                        res.end(JSON.stringify({message: `data inserted successfully`}));
                    })
                    .catch(err => {
                        res.end(JSON.stringify({
                            code: 1,
                            message: `row not added to table ${table}`
                        }));
                    });
                } else {
                    console.log("No model found for table " + table);
                }
            } catch {
                console.log("PARSE ERROR");
            }
        })
    }
}

module.exports = POST;
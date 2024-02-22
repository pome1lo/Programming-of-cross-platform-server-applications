const sequelize = require('../config'); 

let PUT = (req, res) => {
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
                   
                    const whereKey = Object.keys(obj)[0];
                    const whereValue = obj[whereKey];

                    Model.update(obj, { where: { [whereKey]: whereValue } })
                    .then(result => {
                        console.log("Updated");
                        res.end(JSON.stringify({message: `data updated successfully`}));
                    })
                    .catch(err => {
                        res.end(JSON.stringify({
                            code: 1,
                            message: `ERROR: Table ${table} row not updated `
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

module.exports = PUT;
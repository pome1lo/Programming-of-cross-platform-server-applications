const sequelize = require('../config'); 

let DELETE = (req, res) => {
    var parseUrl = require('url').parse(req.url);

    if (parseUrl.pathname.includes("/api/")) {
        var str = parseUrl.pathname.replace("/api/", "");

       
        var table = str.substring(0, str.indexOf("/"));
        var id = str.replace(table + "/", "");
        console.log("table: " + table + " id: " + id);

       
        id = decodeURIComponent(id);

      
        const Model = sequelize.models[table];

        if(Model) {
           
            const whereKey = Object.keys(Model.rawAttributes)[0];

            Model.destroy({ where: { [whereKey]: id } })
            .then(result => {
                if(result) {
                    console.log("Deleted");
                    res.end(JSON.stringify({message: `data deleted successfully`}));
                } else {
                    res.end(JSON.stringify({
                        code: 2,
                        message: "ERROR: no such data"
                    }));
                }
            })
            .catch(err => {
                res.end(JSON.stringify({
                    code: 1,
                    message: `ERROR: row not deleted from table ${table} `
                }));
            });
        } else {
            console.log("No model found for table " + table);
        }
    }
}

module.exports = DELETE;
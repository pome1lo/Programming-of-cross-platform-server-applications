const http = require('http');

const getHandler = require('./modules/methods/get');
const postHandler = require('./modules/methods/post');
const putHandler = require('./modules/methods/put');
const deleteHandler = require('./modules/methods/delete');

const Database = require("./modules/database");
const DataBaseHandler = new Database();

http.createServer(async (req, res) => {
    switch (req.method) {
        case 'GET':    await getHandler(req, res, DataBaseHandler); break;
        case 'POST':   await postHandler(req, res, DataBaseHandler);break;
        case 'PUT':    await putHandler(req, res, DataBaseHandler); break;
        case 'DELETE': await deleteHandler(req, res, DataBaseHandler); break;
    }
}).listen(3000);
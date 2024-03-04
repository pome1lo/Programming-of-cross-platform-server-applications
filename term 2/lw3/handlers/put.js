var http = require('http');
var fs = require('fs');
const url = require('url');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

let PUT = (req, res) => {
    var parseUrl = require('url').parse(req.url);
    var insertedObject = '';
  
    if (parseUrl.pathname.includes("/api/")) {
      var table = parseUrl.pathname.replace("/api/", "");
      console.log("table: " + table);
  
      req.on('data', async (data) => {
        insertedObject += data;
      });
  
      req.on('end', async () => {
        try {
          let obj = JSON.parse(insertedObject);
          console.log(obj);
  
          const whereKey = Object.keys(obj)[0];
          const whereValue = obj[whereKey];
  
          const result = await prisma[table].update({
            where: {
              [whereKey]: whereValue
            },
            data: obj
          });
  
          console.log("Updated");
          res.end(JSON.stringify({ message: 'Data updated successfully' }));
        } catch (error) {
          console.error('Error:', error);
          res.end(JSON.stringify({
            code: 1,
            message: `Failed to update data in table ${table}`
          }));
        }
      });
    }
  } 

module.exports = PUT;
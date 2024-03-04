var http = require('http');
var fs = require('fs');
const url = require('url');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

let GET = async (req, res) => {
    var parseUrl = require('url').parse(req.url);

    if (parseUrl.pathname.includes("/api/faculties/")) {
        var facultyCode = decodeURIComponent(parseUrl.pathname.replace("/api/faculties/", ""));
        const faculty = await prisma.FACULTY.findUnique({
            where: {
                FACULTY: facultyCode
            },
            include: {
                PULPIT_PULPIT_FACULTYToFACULTY: {
                    include: {
                        SUBJECT_SUBJECT_PULPITToPULPIT: true
                    }
                }
            }
        });
        res.end(JSON.stringify(faculty));
    } 
    
    else if (parseUrl.pathname.includes("/api/auditoriumtypes/")) {
        var auditoriumTypeCode = decodeURIComponent(parseUrl.pathname.replace("/api/auditoriumtypes/", ""));
        const auditoriums = await prisma.AUDITORIUM.findMany({
            where: {
                AUDITORIUM_TYPE: auditoriumTypeCode
            }
        });
        res.end(JSON.stringify(auditoriums));
    } 
    
    else if (parseUrl.pathname === '/api/auditoriumsWithComp1') {
        const auditoriums = await prisma.AUDITORIUM.findMany({
            where: {
                AUDITORIUM_NAME:{
                    contains: "-1"
                },
                AUDITORIUM_TYPE:{
                    contains: "ЛБ-К"
                }
            }
        });
        res.end(JSON.stringify(auditoriums));
    } 
    
    else if (parseUrl.pathname === '/api/pulpitsWithoutTeachers') {
        const pulpits = await prisma.PULPIT.findMany({
            include: {
                TEACHER_TEACHER_PULPITToPULPIT: {
               where: {
                TEACHER_NAME: null
               }
                }
                }  
        });
        res.end(JSON.stringify(pulpits));
    } 
    
    else if (parseUrl.pathname === '/api/pulpitsWithVladimir') {
        const pulpits = await prisma.PULPIT.findMany({
           
                    include: {
                        TEACHER_TEACHER_PULPITToPULPIT: {
                       where: {
                        TEACHER_NAME:{
                            contains: "Владимир"
                        }
                       }
                        }
                        }  
        });
        res.end(JSON.stringify(pulpits));
    }
    
   else if (parseUrl.pathname === '/api/auditoriumsSameCount') {
  try {
    const countMap = {};
    
    const auditoriums = await prisma.AUDITORIUM.findMany();
    auditoriums.forEach(auditorium => {
        const key = auditorium.AUDITORIUM_TYPE + auditorium.AUDITORIUM_CAPACITY.toString();
        countMap[key] = (countMap[key] || 0) + 1;
    });
    res.end(JSON.stringify(countMap));
  } catch (error) {
    res.end(JSON.stringify({
      code: 1,
      message: `Failed to process auditoriumsSameCount request: ${error.message}`
    }));
  }
}
else if (parseUrl.pathname.includes("/api/pulpit")) {

  const parseUrl = url.parse(req.url, true);

const currentPage = parseInt(parseUrl.query._page) || 1;
  
  const itemsPerPage = parseInt(parseUrl.query._limit ) || 9; 

    try {
        const totalCount = await prisma.PULPIT.count();
        const data = await prisma.PULPIT.findMany({

            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage,
            include: {
              _count:{
                select:{
                  TEACHER_TEACHER_PULPITToPULPIT: true
                }
              }
            }
            
        });

        res.end(JSON.stringify({ data, totalPages: Math.ceil(totalCount / itemsPerPage) }));
    } 
    catch (error) {
        res.end(JSON.stringify({
            code: 1,
            message: `Failed to select data from table ${table}`
        }));
    }
} 

    else if (parseUrl.pathname.includes("/api/")) {
        var table = parseUrl.pathname.replace("/api/", "").toUpperCase();;
        console.log("table: " + table);
        try {
            const data = await prisma[table].findMany();
            res.end(JSON.stringify(data));
        } catch (error) {
            res.end(JSON.stringify({
                code: 1,
                message: `Failed to select data from table ${table}`
            }));
        }
    } 
    
    else if (parseUrl.pathname === '/') {
        let html = fs.readFileSync('index.html');
        res.writeHead(200, {
            'Content-Type' : 'text/html;charset=utf-8'
        });
        res.end(html);
    }

    else if (parseUrl.pathname === '/fluent') {

        const faculty = await prisma.FACULTY
        .findUnique({where: {FACULTY: 'ИЭФ'}})
        .PULPIT_PULPIT_FACULTYToFACULTY()
      
        res.end(JSON.stringify(faculty));
    }
    
    console.log(parseUrl);
}

module.exports = GET;
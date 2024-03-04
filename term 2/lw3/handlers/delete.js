var http = require('http');
var fs = require('fs');
const url = require('url');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


let DELETE = (req, res) => {
    var parseUrl = require('url').parse(req.url);
  
    if (parseUrl.pathname.includes("/api/PULPIT/")) {
      var pulpitId = decodeURIComponent(parseUrl.pathname.replace("/api/PULPIT/", ""));
  
      prisma.PULPIT.delete({
        where: { PULPIT: pulpitId }
      }).then(() => {
        console.log("Deleted pulpit with id: " + pulpitId);
        res.end(JSON.stringify({ message: 'Pulpit deleted successfully' }));
      }).catch(error => {
        console.error('Error:', error);
        res.end(JSON.stringify({
          code: 1,
          message: 'Failed to delete pulpit'
        }));
      });
  
    } 
  
    else if (parseUrl.pathname.includes("/api/FACULTY/")) {
        var FACULTYId = decodeURIComponent(parseUrl.pathname.replace("/api/FACULTY/", ""));
    
  
        prisma.FACULTY.delete({
          where: { FACULTY: FACULTYId  }
        }).then(() => {
          console.log("Deleted faculty with id: " + subjectId);
          res.end(JSON.stringify({ message: 'Faculty deleted successfully' }));
        }).catch(error => {
          console.error('Error:', error);
          res.end(JSON.stringify({
            code: 1,
            message: 'Failed to delete faculty'
          }));
        });
    
      }
    
    else if (parseUrl.pathname.includes("/api/SUBJECT/")) {
      var subjectId = decodeURIComponent(parseUrl.pathname.replace("/api/SUBJECT/", ""));
  
      prisma.SUBJECT.delete({
        where: { SUBJECT: subjectId  }
      }).then(() => {
        console.log("Deleted subject with id: " + subjectId);
        res.end(JSON.stringify({ message: 'Subject deleted successfully' }));
      }).catch(error => {
        console.error('Error:', error);
        res.end(JSON.stringify({
          code: 1,
          message: 'Failed to delete subject'
        }));
      });
  
    } 
    
    else if (parseUrl.pathname.includes("/api/TEACHER/")) {
      var teacherId = decodeURIComponent(parseUrl.pathname.replace("/api/TEACHER/", ""));
  
      prisma.TEACHER.delete({
        where: { TEACHER: teacherId  }
      }).then(() => {
        console.log("Deleted teacher with id: " + teacherId);
        res.end(JSON.stringify({ message: 'Teacher deleted successfully' }));
      }).catch(error => {
        console.error('Error:', error);
        res.end(JSON.stringify({
          code: 1,
          message: 'Failed to delete teacher'
        }));
      });
  
    } 
    
    else if (parseUrl.pathname.includes("/api/AUDITORIUM_TYPE/")) {
      var auditoriumTypeId = decodeURIComponent(parseUrl.pathname.replace("/api/AUDITORIUM_TYPE/", ""));
  
      prisma.AUDITORIUM_TYPE.delete({
        where: { AUDITORIUM_TYPE: auditoriumTypeId  }
      }).then(() => {
        console.log("Deleted auditorium type with id: " + auditoriumTypeId);
        res.end(JSON.stringify({ message: 'Auditorium type deleted successfully' }));
      }).catch(error => {
        console.error('Error:', error);
        res.end(JSON.stringify({
          code: 1,
          message: 'Failed to delete auditorium type'
        }));
      });
  
    } 
    
    else if (parseUrl.pathname.includes("/api/AUDITORIUM/")) {
      var auditoriumId = decodeURIComponent(parseUrl.pathname.replace("/api/AUDITORIUM/", ""));
  
      prisma.AUDITORIUM.delete({
        where: {AUDITORIUM: auditoriumId  }
      }).then(() => {
        console.log("Deleted auditorium with id: " + auditoriumId);
        res.end(JSON.stringify({ message: 'Auditorium deleted successfully' }));
      }).catch(error => {
        console.error('Error:', error);
        res.end(JSON.stringify({
          code: 1,
          message: 'Failed to delete auditorium'
        }));
      });
  
    }
} 
 
module.exports = DELETE;
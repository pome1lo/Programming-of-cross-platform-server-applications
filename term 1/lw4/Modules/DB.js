var util = require('util');
var ee = require('events');

db_data = [
    {id: '1', name: 'vasia', bday: '2000-03-01'},
    {id: '2', name: 'sasha', bday: '2001-05-06'},
    {id: '3', name: 'vanya', bday: '2005-12-12'},
    {id: '4', name: 'senia', bday: '2009-11-01'},
    {id: '5', name: 'stepa', bday: '2005-06-08'}
];

function DB(){
    this.select = () => {
        console.log('DB.GET'); 
        return db_data;
    };
    
    this.insert = (Person) => {
        console.log('DB.POST');
        db_data.push(Person);
    };

    this.delete = (person_id) => {
        console.log('DB.DELETE');
        let index = db_data.findIndex(item => item.id == person_id);
        let data = db_data[index];
        db_data.splice(index, 1);
        return data;
    };
    
    this.update = (person) => {
        console.log('DB.PUT');
        let index = db_data.findIndex(item => item.id == person.id); 
        db_data.splice(index, 1, person);
    };      
}

util.inherits(DB, ee.EventEmitter);
exports.DB=DB;
const { Sequelize } = require('sequelize');
// const Pulpit = require('./models/Pulpit');
// const Auditorium = require('./models/Auditorium');
// const AuditoriumType = require('./models/AuditoriumType');
// const Faculty = require('./models/Faculty');
// const Subject = require('./models/Subject');
// const Teacher = require('./models/Teacher');

const sequelize = new Sequelize('PSCP', 'sa', '@2o!&69', {
  host: 'localhost',
  dialect: 'mssql',
  dialectOptions: {
    options: {
      trustServerCertificate: true,
    },
  },
});


// Начало транзакции
sequelize.transaction(async (t) => {
  await Auditorium.update({ capacity: 0 }, { transaction: t });

  await new Promise(resolve => setTimeout(resolve, 10000));

  throw new Error('Откат изменений');
})
.then(() => {
  console.log('Транзакция успешно выполнена');
})
.catch(() => { console.log('Транзакция откатилась');
});


module.exports = sequelize;

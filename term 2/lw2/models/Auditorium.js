const { Sequelize, DataTypes, Op } = require('sequelize');
const sequelize = require('../config.js');
const AUDITORIUM_TYPE = require('./AuditoriumType.js'); 


const AUDITORIUM = sequelize.define('AUDITORIUM', {
  AUDITORIUM: {
    type: DataTypes.STRING(10),
    allowNull: false,
    primaryKey: true
  },
  AUDITORIUM_NAME: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  AUDITORIUM_CAPACITY: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  AUDITORIUM_TYPE: {
    type: DataTypes.STRING(10),
    allowNull: false,
    references: {
      model: AUDITORIUM_TYPE,
      key: 'AUDITORIUM_TYPE'
    }
  }
}, {
  timestamps: false,
  freezeTableName: true,
  scopes: {
    MyScope: {
        where: {
          AUDITORIUM_CAPACITY: {
            [Op.between]: [10, 60]
          }
        }
      }
    }
});

module.exports = AUDITORIUM;

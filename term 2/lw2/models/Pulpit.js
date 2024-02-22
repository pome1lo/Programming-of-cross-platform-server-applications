const { Sequelize, DataTypes, Op } = require('sequelize');
const sequelize = require('../config.js');
const FACULTY = require('./Faculty.js'); 

const PULPIT = sequelize.define('PULPIT', {
  PULPIT: {
    type: DataTypes.STRING(10),
    allowNull: false,
    primaryKey: true
  },
  PULPIT_NAME: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  FACULTY: {
    type: DataTypes.STRING(10),
    allowNull: false,
    references: {
      model: FACULTY,
      key: 'FACULTY'
    }
  }
}, {
  timestamps: false,
  freezeTableName: true
});

module.exports = PULPIT;

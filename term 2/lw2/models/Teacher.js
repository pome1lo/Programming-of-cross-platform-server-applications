const { Sequelize, DataTypes, Op } = require('sequelize');
const sequelize = require('../config.js');
const PULPIT = require('./Pulpit.js'); 

const TEACHER = sequelize.define('TEACHER', {
  TEACHER: {
    type: DataTypes.STRING(10),
    allowNull: false,
    primaryKey: true
  },
  TEACHER_NAME: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  PULPIT: {
    type: DataTypes.STRING(10),
    allowNull: false,
    references: {
      model: PULPIT,
      key: 'PULPIT'
    }
  }
}, {
  timestamps: false,
  freezeTableName: true
});

module.exports = TEACHER;

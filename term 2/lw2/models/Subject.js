const { Sequelize, DataTypes, Op } = require('sequelize');
const sequelize = require('../config.js');
const PULPIT = require('./Pulpit.js'); 

const SUBJECT = sequelize.define('SUBJECT', {
  SUBJECT: {
    type: DataTypes.STRING(10),
    allowNull: false,
    primaryKey: true
  },
  SUBJECT_NAME: {
    type: DataTypes.STRING(50),
    allowNull: false
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

module.exports = SUBJECT;

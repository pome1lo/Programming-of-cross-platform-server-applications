const { Sequelize, DataTypes, Op } = require('sequelize');
const sequelize = require('../config.js');

const AUDITORIUM_TYPE = sequelize.define('AUDITORIUM_TYPE', {
  AUDITORIUM_TYPE: {
    type: DataTypes.STRING(10),
    allowNull: false,
    primaryKey: true
  },
  AUDITORIUM_TYPENAME: {
    type: DataTypes.STRING(30),
    allowNull: false
  }
}, {
  timestamps: false,
  freezeTableName: true
});

module.exports = AUDITORIUM_TYPE;

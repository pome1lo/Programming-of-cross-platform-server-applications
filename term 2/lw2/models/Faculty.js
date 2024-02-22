const { Sequelize, DataTypes, Op } = require('sequelize');
const sequelize = require('../config.js');

const FACULTY = sequelize.define('FACULTY', {
  FACULTY: {
    type: DataTypes.STRING(10),
    allowNull: false,
    primaryKey: true
  },
  FACULTY_NAME: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  timestamps: false,
  freezeTableName: true,
  hooks: {
      beforeCreate: (faculty, options) => {
        console.log('Before creating a faculty');
      },
      afterCreate: (faculty, options) => {
        console.log('After creating a faculty');
      }
    }
});

module.exports = FACULTY;

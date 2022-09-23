const Sequelize = require('sequelize')
const db = require('../db')

const Order = db.define('order', {
  checkout: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
    allowNull: false
  }
})

module.exports = Order

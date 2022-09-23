const Sequelize = require('sequelize')
const db = require('../db')

const productOrder = db.define('productOrder', {
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
})

module.exports = productOrder

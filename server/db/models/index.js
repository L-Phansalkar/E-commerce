const User = require('./user')
const Product = require('./product')
const Order = require('./order')
const productOrder = require('./productOrder')
/**
 * If we had any associations to make, this would be a great place to put them!
 * ex. if we had another model called BlogPost, we might say:
 *
 *    BlogPost.belongsTo(User)
 */
Product.belongsToMany(Order, {through: productOrder})

Order.belongsToMany(Product, {through: productOrder})
Order.belongsTo(User)
Order.hasMany(productOrder)
productOrder.belongsTo(Order)
Product.hasMany(productOrder)
productOrder.belongsTo(Product)
User.hasMany(Order)
/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */
module.exports = {
  User,
  Product,
  Order,
  productOrder
}

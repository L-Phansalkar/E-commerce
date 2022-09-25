const router = require('express').Router()
const {Order, productOrder, Product} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const [currentOrder, created] = await Order.findOrCreate({
      where: {
        userId: req.user.id,
        checkout: false
      },
      attributes: ['id'],
      include: {
        model: productOrder,
        attributes: ['quantity'],
        include: {
          model: Product,
          attributes: ['name', 'price', 'id']
        }
      }
    })

    res.json(currentOrder)
  } catch (err) {
    next(err)
  }
})

router.get('/history', async (req, res, next) => {
  try {
    const allOrders = await Order.findAll({
      where: {
        userId: req.user.id
      },
      include: productOrder
    })
    res.json(allOrders)
  } catch (err) {
    next(err)
  }
})

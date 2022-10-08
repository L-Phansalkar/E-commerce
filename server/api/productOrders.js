const router = require('express').Router()
const {Order, productOrder} = require('../db/models')
module.exports = router

router.post('/:productId/:orderId', async (req, res, next) => {
  try {
    const [currentOrder, created] = await productOrder.findOrCreate({
      where: {
        productId: req.params.productId,
        orderId: req.params.orderId
      }
    })
    if (!created) {
      currentOrder.quantity++
    }
    await currentOrder.save()
    res.json(currentOrder)
  } catch (err) {
    next(err)
  }
})

router.put('/:productId/:orderId', async (req, res, next) => {
  try {
    const currentOrder = await productOrder.findOne({
      where: {
        productId: req.params.productId,
        orderId: req.params.orderId
      }
    })
    if (currentOrder.quantity > 1) {
      currentOrder.quantity--
    }
    await currentOrder.save()
    res.json(currentOrder)
  } catch (err) {
    next(err)
  }
})

router.delete('/:productId/:orderId', async (req, res, next) => {
  try {
    const currentOrder = await productOrder.destroy({
      where: {
        productId: req.params.productId,
        orderId: req.params.orderId
      }
    })
    res.json(currentOrder)
  } catch (err) {
    next(err)
  }
})

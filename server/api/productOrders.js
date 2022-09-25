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

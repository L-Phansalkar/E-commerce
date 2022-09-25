const router = require('express').Router()
const {Order, productOrder} = require('../db/models')
module.exports = router

router.post('/:productId/:orderId', async (req, res, next) => {
  console.log('req', req)
  try {
    const [currentOrder, created] = await productOrder.findOrCreate({
      where: {
        productId: req.params.productId,
        orderId: req.params.orderId
      }
    })
    console.log('values', currentOrder.quantity, created)
    if (!created) {
      currentOrder.quantity++
    }
    await currentOrder.save()
    res.json(currentOrder)
  } catch (err) {
    next(err)
  }
})

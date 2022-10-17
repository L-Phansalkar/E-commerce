const router = require('express').Router();
const {Order, productOrder, Product} = require('../db/models');
module.exports = router;
const stripe = require('stripe')(
  'sk_test_51LlxulLVr6OUxlRlR91VhHOpLdssn3R0ECRPZs2H3QkB8RSlfYnHeiW606Mo7611ihw2turybvzBWAPHL26JqYp500QQhr3A8F'
);

router.get('/', async (req, res, next) => {
  try {
    const [currentOrder, created] = await Order.findOrCreate({
      where: {
        userId: req.user.id,
        checkout: false,
      },
      attributes: ['id'],
      include: {
        model: productOrder,
        attributes: ['quantity', 'productId'],
        order: [['createdAt', 'DESC']],
        include: {
          model: Product,
          attributes: ['name', 'price', 'id', 'image'],
        },
      },
    });

    res.json(currentOrder);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/create-checkout-session', async (req, res) => {
  const checkoutOrder = await Order.findByPk(req.params.id, {
    include: {
      model: productOrder,
      attributes: ['quantity'],
      include: {
        model: Product,
        attributes: ['stripe'],
      },
    },
  });
  let lineItems = [];
  checkoutOrder.productOrders.forEach((item) =>
    lineItems.push({
      price: item.product.stripe,
      quantity: item.quantity,
    })
  );
  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: 'payment',
    success_url: `http://localhost:8080/confirm`,
    cancel_url: `http://localhost:8080/cart`,
  });
  // res.redirect(303, session.url);
  res.json({
    checkoutSessionUrl: session.url,
  });
});

router.get('/history', async (req, res, next) => {
  try {
    const allOrders = await Order.findAll({
      where: {
        userId: req.user.id,
      },
      include: productOrder,
    });
    res.json(allOrders);
  } catch (err) {
    next(err);
  }
});

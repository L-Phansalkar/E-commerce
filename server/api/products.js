const router = require('express').Router();
const {Product} = require('../db/models');
module.exports = router;

router.get('/', async (req, res, next) => {
  try {
    const products = await Product.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['name', 'image', 'price', 'id'],
      order: [
        ['year', 'ASC'],
        ['name', 'ASC'],
      ],
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
});
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      attributes: [
        'name',
        'image',
        'description',
        'price',
        'inventory',
        'id',
        'songs',
        'year',
      ],
    });
    res.json(product);
  } catch (err) {
    next(err);
  }
});
router.put('/:id', async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      attributes: [
        'name',
        'image',
        'description',
        'price',
        'inventory',
        'id',
        'songs',
        'year',
      ],
    });
    product.inventory--;
    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
});

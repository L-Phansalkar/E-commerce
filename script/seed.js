'use strict'

const db = require('../server/db')
const {User, Product, Order} = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const users = await Promise.all([
    User.create({email: 'cody@email.com', password: '123'}),
    User.create({email: 'murphy@email.com', password: '123'})
  ])
  const products = await Promise.all([
    Product.create({
      name: 'Smiling Frog',
      image:
        'https://cdn.britannica.com/84/206384-050-00698723/Javan-gliding-tree-frog.jpg',
      description: 'heres a thing i guess',
      price: '3.99',
      inventory: '26'
    }),
    Product.create({
      name: 'Big Eye Frog',
      image:
        'https://www.nhm.ac.uk/content/dam/nhmwww/discover/frog-eyes-evolution/frog-eyes-chubby-frog-flower-full-width.jpg',
      description: 'heres a second thing i guess',
      price: '9.99',
      inventory: '26'
    })
  ])
  const orders = await Promise.all([Order.create()])
  console.log(`seeded ${users.length} users`)
  console.log(`seeded ${products.length} products`)
  console.log(`seeded ${orders.length} orders`)
  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed

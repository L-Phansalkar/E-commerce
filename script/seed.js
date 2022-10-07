'use strict'

const db = require('../server/db')
const {User, Product, Order, productOrder} = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const users = await Promise.all([
    User.create({email: 'cody@email.com', password: '123'}),
    User.create({email: 'murphy@email.com', password: '123'})
  ])
  const products = await Promise.all([
    Product.create({
      name: 'Big Mouth Billy Bass The Singing Sensation',
      image:
        'https://cdn.britannica.com/84/206384-050-00698723/Javan-gliding-tree-frog.jpg',
      description: 'The original singing fish!',
      price: '3.99',
      inventory: '26',
      year: '1998',
      songs: "Take Me To The River, Don't Worry Be Happy"
    }),
    Product.create({
      name: 'Big Mouth Billy Bass Sings For The Holidays V1',
      image:
        'https://www.nhm.ac.uk/content/dam/nhmwww/discover/frog-eyes-evolution/frog-eyes-chubby-frog-flower-full-width.jpg',
      description:
        'A Christmas themed version of Billy Bass. He wears a Santa hat and has a small jingle bell wrapped around his tail.',
      price: '9.99',
      inventory: '26',
      year: '1999',
      songs:
        'Blues version of Twas The Night Before Christmas (which is a parody of Trouble by Elvis Presley)'
    }),
    Product.create({
      name: 'Big Mouth Billy Bass Sings For The Holidays V2',
      image:
        'https://www.nhm.ac.uk/content/dam/nhmwww/discover/frog-eyes-evolution/frog-eyes-chubby-frog-flower-full-width.jpg',
      description:
        'A Christmas themed version of Billy Bass. He wears a Santa hat and has a small jingle bell wrapped around his tail.',
      price: '9.99',
      inventory: '26',
      year: '2000',
      songs: 'Country versions of Jingle Bells and Up On A Housetop'
    }),
    Product.create({
      name: 'World Record Billy Bass',
      image:
        'https://www.nhm.ac.uk/content/dam/nhmwww/discover/frog-eyes-evolution/frog-eyes-chubby-frog-flower-full-width.jpg',
      description:
        ' A giant 28" lunker singing fish sold exclusively at KayBee Toys. The fish comes with an extra nameplate that reads "WORLD RECORD BILLY BASS" that can be placed via peel off tape over the existing "BIG MOUTH BILLY BASS" nameplate.',
      price: '9.99',
      inventory: '26',
      year: '2000',
      songs: "Take Me To The River, Don't Worry Be Happy"
    }),
    Product.create({
      name: 'Big Mouth Billy Bones',
      image:
        'https://www.nhm.ac.uk/content/dam/nhmwww/discover/frog-eyes-evolution/frog-eyes-chubby-frog-flower-full-width.jpg',
      description:
        'A singing skeleton fish made for Halloween. Billy Bones appears to be the deceased brother of Billy Bass. His bones also glow in the dark.',
      price: '9.99',
      inventory: '26',
      year: '2000',
      songs: 'Bad To The Bone'
    }),
    Product.create({
      name: 'Big Mouth Billy Bass Musical Keychain',
      image:
        'https://www.nhm.ac.uk/content/dam/nhmwww/discover/frog-eyes-evolution/frog-eyes-chubby-frog-flower-full-width.jpg',
      description:
        "A very small static version of Billy Bass that is attached to a clip. This version lacks a plaque and doesn't have movement. You activate him by pressing a small button near his tail.",
      price: '9.99',
      inventory: '26',
      year: '2000',
      songs: "Take Me To The River, Don't Worry Be Happy"
    }),
    Product.create({
      name: 'Big Mouth Billy Bass Cupholder',
      image:
        'https://www.nhm.ac.uk/content/dam/nhmwww/discover/frog-eyes-evolution/frog-eyes-chubby-frog-flower-full-width.jpg',
      description:
        'The mouth is hollow so it can hold your drinking cup. It can be activated by squeezing the lower half of the head.',
      price: '9.99',
      inventory: '26',
      year: '2000',
      songs: "Take Me To The River, Don't Worry Be Happy"
    }),
    Product.create({
      name: 'Big Mouth Billy Bass Superstar',
      image:
        'https://www.nhm.ac.uk/content/dam/nhmwww/discover/frog-eyes-evolution/frog-eyes-chubby-frog-flower-full-width.jpg',
      description:
        'A special edition of Billy Bass. He stands on his tail on a stage (Black round base) and holds a microphone. He taps his tail, sways his body and sings into the microphone.',
      price: '9.99',
      inventory: '26',
      year: '2001',
      songs: 'Act Naturally and a parody of I Will Survive'
    }),
    Product.create({
      name: 'Big Mouth Billy Bass Jr',
      image:
        'https://www.nhm.ac.uk/content/dam/nhmwww/discover/frog-eyes-evolution/frog-eyes-chubby-frog-flower-full-width.jpg',
      description:
        "A smaller version of Billy Bass on an oval plaque. Made for Billy's 5th birthday.",
      price: '9.99',
      inventory: '26',
      year: '2004',
      songs: 'parody of I Will Survive and Take Me To The River'
    }),
    Product.create({
      name: 'Mini Big Mouth Billy Bass REC+PLAY',
      image:
        'https://www.nhm.ac.uk/content/dam/nhmwww/discover/frog-eyes-evolution/frog-eyes-chubby-frog-flower-full-width.jpg',
      description:
        "A miniature version of Billy Bass released sold at CVS and Cabela's. Made for Billy's 10th birthday. This version is very fragile and known to break easily.",
      price: '9.99',
      inventory: '26',
      year: '2009',
      songs: 'Recorded message (up to 9 seconds) and Take Me To The River'
    }),
    Product.create({
      name: 'Big Mouth Billy Bass 15th Anniversary Edition',
      image:
        'https://www.nhm.ac.uk/content/dam/nhmwww/discover/frog-eyes-evolution/frog-eyes-chubby-frog-flower-full-width.jpg',
      description:
        "Billy is mounted on an oval shaped plaque and has a shiny nameplate with his name and logo. Made for Billy's 15th birthday.",
      price: '9.99',
      inventory: '26',
      year: '2014',
      songs: "Don't Worry Be Happy and a parody of I Will Survive"
    }),
    Product.create({
      name: 'Big Mouth Billy Bones 15th Anniversary Edition',
      image:
        'https://www.nhm.ac.uk/content/dam/nhmwww/discover/frog-eyes-evolution/frog-eyes-chubby-frog-flower-full-width.jpg',
      description:
        ' This Billy Bones is mounted on a black oval shaped plaque, has red LEDs on his eyes and mouth, and lacks a nameplate. ',
      price: '9.99',
      inventory: '26',
      year: '2015',
      songs: 'Bad To The Bone'
    }),
    Product.create({
      name: 'Big Mouth Billy Bass 15th Anniversary Christmas Edition',
      image:
        'https://www.nhm.ac.uk/content/dam/nhmwww/discover/frog-eyes-evolution/frog-eyes-chubby-frog-flower-full-width.jpg',
      description: ' This Billy Bones wears a Santa hat.',
      price: '9.99',
      inventory: '26',
      year: '2015',
      songs:
        'Billy Bass themed parody of Jingle Bells and a parody of I Will Survive'
    }),
    Product.create({
      name: 'Big Mouth Billy Bass Survivor Edition',
      image:
        'https://www.nhm.ac.uk/content/dam/nhmwww/discover/frog-eyes-evolution/frog-eyes-chubby-frog-flower-full-width.jpg',
      description:
        'Sold exclusively at Cracker Barrel, now with improved movements.',
      price: '9.99',
      inventory: '26',
      year: '2018',
      songs: 'Parody of I Will Survive and Dont Worry Be Happy'
    }),
    Product.create({
      name: 'Big Mouth Billy Bass The Speaking Sensation',
      image:
        'https://www.nhm.ac.uk/content/dam/nhmwww/discover/frog-eyes-evolution/frog-eyes-chubby-frog-flower-full-width.jpg',
      description:
        "A special version of Billy Bass that is compatible with Alexa via Bluetooth to an Amazon Echo device. He moves his mouth in sync with Alexa's voice, turns his head outward when saying the wake word,and dances to music.",
      price: '9.99',
      inventory: '26',
      year: '2018',
      songs: "exclusive song called Fishin' Time"
    }),
    Product.create({
      name: 'Classic Plaque Big Mouth Billy Bass',
      image:
        'https://www.nhm.ac.uk/content/dam/nhmwww/discover/frog-eyes-evolution/frog-eyes-chubby-frog-flower-full-width.jpg',
      description: 'Features classic plaque design.',
      price: '9.99',
      inventory: '26',
      year: '2021',
      songs: 'Take Me to the River and Huntin’, Fishin’, and Lovin’ Every Day'
    })
  ])
  const orders = await Promise.all([Order.create({userId: '1'})])
  const productOrders = await Promise.all([
    productOrder.create({productId: '2', quantity: '3', orderId: '1'})
  ])
  console.log(`seeded ${users.length} users`)
  console.log(`seeded ${products.length} products`)
  console.log(`seeded ${orders.length} orders`)
  console.log(`seeded ${productOrders.length} productOrders`)
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

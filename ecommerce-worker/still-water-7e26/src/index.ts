import { Hono } from 'hono'
import { cors } from 'hono/cors'

// Types
interface Product {
  id?: number
  name: string
  image: string
  description?: string
  price: number
  inventory: number
  year?: number
  songs?: string
  stripe?: string
}

interface User {
  id?: number
  email: string
  password_hash?: string
  google_id?: string
}

interface Order {
  id?: number
  userId: number
  checkout: boolean
  created_at?: string
}

interface ProductOrder {
  id?: number
  order_id: number
  product_id: number
  quantity: number
}

// Environment interface
interface Env {
  DB: D1Database
}

const app = new Hono<{ Bindings: Env }>()

// CORS middleware
app.use('/*', cors({
  origin: ['http://localhost:8080', 'https://ecommerce-app-new.pages.dev', 'https://6544a78f.ecommerce-app-new.pages.dev', 'https://a48a68f3.ecommerce-app-new.pages.dev', 'https://b89bb057.ecommerce-app-new-8hg.pages.dev' ],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))

// Initialize database tables
app.get('/init-db', async (c) => {
  try {
    const results = []
    
    // Create users table
    try {
      await c.env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT,
          google_id TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `).run()
      results.push('Users table created')
    } catch (e) {
      results.push(`Users table error: ${e.message}`)
    }

    // Create products table
    try {
      await c.env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          image TEXT NOT NULL,
          description TEXT,
          price REAL NOT NULL,
          inventory INTEGER NOT NULL,
          year INTEGER,
          songs TEXT,
          stripe TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `).run()
      results.push('Products table created')
    } catch (e) {
      results.push(`Products table error: ${e.message}`)
    }

    // Create orders table
    try {
      await c.env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          checkout INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `).run()
      results.push('Orders table created')
    } catch (e) {
      results.push(`Orders table error: ${e.message}`)
    }

    // Create product_orders table (junction table)
    try {
      await c.env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS product_orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER NOT NULL,
          product_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `).run()
      results.push('Product orders table created')
    } catch (e) {
      results.push(`Product orders table error: ${e.message}`)
    }

    return c.json({ 
      message: 'Database initialization completed',
      details: results
    })
  } catch (error) {
    console.error('Database initialization error:', error)
    return c.json({ 
      error: 'Failed to initialize database',
      details: error.message 
    }, 500)
  }
})

// Seed initial products
app.post('/seed-products', async (c) => {
  try {
    const products = [
      {
        name: 'Big Mouth Billy Bass The Singing Sensation',
      image: 'https://i.ebayimg.com/images/g/JQ4AAOSw2w5gDO6t/s-l500.jpg',
      description: 'The original singing fish!',
      price: '9.99',
      inventory: '26',
      year: '1998',
      songs: "Take Me To The River, Don't Worry Be Happy",
      stripe: 'price_1LqiVwLVr6OUxlRlXarYijRo',
      },
      {
    name: 'Big Mouth Billy Bass Sings For The Holidays V1',
      image:
        'https://i.etsystatic.com/12164314/r/il/689569/3331563655/il_fullxfull.3331563655_bmk6.jpg',
      description:
        'A Christmas themed version of Billy Bass. He wears a Santa hat and has a small jingle bell wrapped around his tail.',
      price: '9.99',
      inventory: '26',
      year: '1999',
      songs:
        'Blues version of Twas The Night Before Christmas (which is a parody of Trouble by Elvis Presley)',
      stripe: 'price_1LqiW9LVr6OUxlRlJkfcX62N',
      },
      {
         name: 'Big Mouth Billy Bass Sings For The Holidays V2',
      image:
        'https://i.etsystatic.com/12164314/r/il/689569/3331563655/il_fullxfull.3331563655_bmk6.jpg',
      description:
        'A Christmas themed version of Billy Bass. He wears a Santa hat and has a small jingle bell wrapped around his tail.',
      price: '9.99',
      inventory: '26',
      year: '2000',
      songs: 'Country versions of Jingle Bells and Up On A Housetop',
      stripe: 'price_1LqiWPLVr6OUxlRlrPqJ0FRz',
      }
    ]

    for (const product of products) {
      await c.env.DB.prepare(`
        INSERT OR IGNORE INTO products (name, image, description, price, inventory, year, songs)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        product.name,
        product.image,
        product.description,
        product.price,
        product.inventory,
        product.year,
        product.songs
      ).run()
    }

    return c.json({ message: 'Products seeded successfully' })
  } catch (error) {
    console.error('Seeding error:', error)
    return c.json({ error: 'Failed to seed products' }, 500)
  }
})

// Products API
app.get('/api/products', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT name, image, price, id 
      FROM products 
      WHERE inventory > 0 
      ORDER BY year ASC, name ASC
    `).all()

    return c.json(results)
  } catch (error) {
    console.error('Products fetch error:', error)
    return c.json({ error: 'Failed to fetch products' }, 500)
  }
})

app.get('/api/products/:id', async (c) => {
  const id = c.req.param('id')
  
  try {
    const product = await c.env.DB.prepare(`
      SELECT name, image, description, price, inventory, id, songs, year
      FROM products 
      WHERE id = ?
    `).bind(id).first()

    if (!product) {
      return c.json({ error: 'Product not found' }, 404)
    }

    return c.json(product)
  } catch (error) {
    console.error('Product fetch error:', error)
    return c.json({ error: 'Failed to fetch product' }, 500)
  }
})

app.put('/api/products/:id/minus', async (c) => {
  const id = c.req.param('id')
  
  try {
    // Get current product
    const product = await c.env.DB.prepare(`
      SELECT * FROM products WHERE id = ?
    `).bind(id).first() as Product

    if (!product) {
      return c.json({ error: 'Product not found' }, 404)
    }

    if (product.inventory > 0) {
      await c.env.DB.prepare(`
        UPDATE products SET inventory = inventory - 1 WHERE id = ?
      `).bind(id).run()
      
      product.inventory--
    }

    return c.json(product)
  } catch (error) {
    console.error('Product update error:', error)
    return c.json({ error: 'Failed to update product' }, 500)
  }
})

app.put('/api/products/:id/plus', async (c) => {
  const id = c.req.param('id')
  
  try {
    await c.env.DB.prepare(`
      UPDATE products SET inventory = inventory + 1 WHERE id = ?
    `).bind(id).run()

    const product = await c.env.DB.prepare(`
      SELECT name, image, description, price, inventory, id, songs, year
      FROM products WHERE id = ?
    `).bind(id).first()

    return c.json(product)
  } catch (error) {
    console.error('Product update error:', error)
    return c.json({ error: 'Failed to update product' }, 500)
  }
})

// Users API  
app.get('/api/users', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT id, email FROM users
    `).all()

    return c.json(results)
  } catch (error) {
    console.error('Users fetch error:', error)
    return c.json({ error: 'Failed to fetch users' }, 500)
  }
})

// Orders API
app.get('/api/orders', async (c) => {
  // For now, we'll use a mock user ID. In production, you'd get this from authentication
  const userId = 1
  
  try {
    // Find or create current order
    let order = await c.env.DB.prepare(`
      SELECT * FROM orders WHERE userId = ? AND checkout = FALSE
    `).bind(userId).first()

    if (!order) {
      // Create new order
      const result = await c.env.DB.prepare(`
        INSERT INTO orders (userId, checkout) VALUES (?, FALSE)
      `).bind(userId).run()
      
      order = { id: result.meta.last_row_id, user_id: userId, checkout: false }
    }

    // Get order items with product details
    const orderItems = await c.env.DB.prepare(`
      SELECT 
        po.quantity,
        po.product_id,
        p.name,
        p.price,
        p.id,
        p.image
      FROM product_orders po
      JOIN products p ON po.product_id = p.id
      WHERE po.order_id = ?
      ORDER BY po.created_at DESC
    `).bind(order.id).all()

    return c.json({
      ...order,
      productOrders: orderItems.results
    })
  } catch (error) {
    console.error('Orders fetch error:', error)
    return c.json({ error: 'Failed to fetch orders' }, 500)
  }
})

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Default route
app.get('/', (c) => {
  return c.json({ 
    message: 'Billy Bass E-commerce API',
    endpoints: {
      'GET /api/products': 'List all products',
      'GET /api/products/:id': 'Get product by ID',
      'PUT /api/products/:id/minus': 'Decrease product inventory',
      'PUT /api/products/:id/plus': 'Increase product inventory',
      'GET /api/users': 'List all users',
      'GET /api/orders': 'Get current user order',
      'GET /init-db': 'Initialize database tables',
      'POST /seed-products': 'Seed initial products'
    }
  })
})

export default app
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
  user_id: number  // Fixed: changed from userId to user_id to match DB
  status?: string
  total?: number
  checkout?: number  // Fixed: should be INTEGER (0/1) not string
  createdAt?: string // matches DB column
  updatedAt?: string // matches DB column
}

interface ProductOrder {
  id?: number
  order_id: number
  productId: number
  quantity: number
}

// Environment interface
interface Env {
  DB: D1Database
}

const app = new Hono<{ Bindings: Env }>()

// Enhanced CORS middleware
app.use('/*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  exposeHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
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

    // Fixed orders table schema
    try {
      await c.env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          checkout INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `).run()
      results.push('Orders table created')
    } catch (e) {
      results.push(`Orders table error: ${e.message}`)
    }

    // Fixed product_orders table
    try {
      await c.env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS product_orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER NOT NULL,
          productId INTEGER NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES orders(id),
          FOREIGN KEY (productId) REFERENCES products(id)
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
        price: 9.99,
        inventory: 26,
        year: 1998,
        songs: "Take Me To The River, Don't Worry Be Happy",
        stripe: 'price_1LqiVwLVr6OUxlRlXarYijRo',
      },
      {
        name: 'Big Mouth Billy Bass Sings For The Holidays V1',
        image: 'https://i.etsystatic.com/12164314/r/il/689569/3331563655/il_fullxfull.3331563655_bmk6.jpg',
        description: 'A Christmas themed version of Billy Bass. He wears a Santa hat and has a small jingle bell wrapped around his tail.',
        price: 9.99,
        inventory: 26,
        year: 1999,
        songs: 'Blues version of Twas The Night Before Christmas (which is a parody of Trouble by Elvis Presley)',
        stripe: 'price_1LqiW9LVr6OUxlRlJkfcX62N',
      },
      {
        name: 'Big Mouth Billy Bass Sings For The Holidays V2',
        image: 'https://i.etsystatic.com/12164314/r/il/689569/3331563655/il_fullxfull.3331563655_bmk6.jpg',
        description: 'A Christmas themed version of Billy Bass. He wears a Santa hat and has a small jingle bell wrapped around his tail.',
        price: 9.99,
        inventory: 26,
        year: 2000,
        songs: 'Country versions of Jingle Bells and Up On A Housetop',
        stripe: 'price_1LqiWPLVr6OUxlRlrPqJ0FRz',
      }
    ]

    for (const product of products) {
      await c.env.DB.prepare(`
        INSERT OR IGNORE INTO products (name, image, description, price, inventory, year, songs, stripe)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        product.name,
        product.image,
        product.description,
        product.price,
        product.inventory,
        product.year,
        product.songs,
        product.stripe
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
    return c.json({ error: 'Failed to fetch products', details: error.message }, 500)
  }
})

// Fixed individual product route
app.get('/api/products/:id', async (c) => {
  const id = c.req.param('id')
  
  // Validate ID is a number
  if (!id || isNaN(Number(id))) {
    return c.json({ error: 'Invalid product ID' }, 400)
  }
  
  try {
    const product = await c.env.DB.prepare(`
      SELECT name, image, description, price, inventory, id, songs, year
      FROM products 
      WHERE id = ?
    `).bind(Number(id)).first()

    if (!product) {
      return c.json({ error: 'Product not found' }, 404)
    }

    return c.json(product)
  } catch (error) {
    console.error('Product fetch error:', error)
    return c.json({ error: 'Failed to fetch product', details: error.message }, 500)
  }
})

app.put('/api/products/:id/minus', async (c) => {
  const id = c.req.param('id')
  
  if (!id || isNaN(Number(id))) {
    return c.json({ error: 'Invalid product ID' }, 400)
  }
  
  try {
    // Get current product
    const product = await c.env.DB.prepare(`
      SELECT * FROM products WHERE id = ?
    `).bind(Number(id)).first() as Product

    if (!product) {
      return c.json({ error: 'Product not found' }, 404)
    }

    if (product.inventory > 0) {
      await c.env.DB.prepare(`
        UPDATE products SET inventory = inventory - 1 WHERE id = ?
      `).bind(Number(id)).run()
      
      // Get updated product
      const updatedProduct = await c.env.DB.prepare(`
        SELECT name, image, description, price, inventory, id, songs, year
        FROM products WHERE id = ?
      `).bind(Number(id)).first()
      
      return c.json(updatedProduct)
    }

    return c.json(product)
  } catch (error) {
    console.error('Product update error:', error)
    return c.json({ error: 'Failed to update product', details: error.message }, 500)
  }
})

app.put('/api/products/:id/plus', async (c) => {
  const id = c.req.param('id')
  
  if (!id || isNaN(Number(id))) {
    return c.json({ error: 'Invalid product ID' }, 400)
  }
  
  try {
    await c.env.DB.prepare(`
      UPDATE products SET inventory = inventory + 1 WHERE id = ?
    `).bind(Number(id)).run()

    const product = await c.env.DB.prepare(`
      SELECT name, image, description, price, inventory, id, songs, year
      FROM products WHERE id = ?
    `).bind(Number(id)).first()

    return c.json(product)
  } catch (error) {
    console.error('Product update error:', error)
    return c.json({ error: 'Failed to update product', details: error.message }, 500)
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
    return c.json({ error: 'Failed to fetch users', details: error.message }, 500)
  }
})

// Fixed Orders API
app.get('/api/orders', async (c) => {
  // For now, we'll use a mock user ID. In production, you'd get this from authentication
  const userId = 1
  
  try {
    console.log('Fetching orders for userId:', userId)
    
    // Find or create current order - Fixed column name
    let order = await c.env.DB.prepare(`
      SELECT * FROM orders WHERE user_id = ? AND checkout = 0
    `).bind(userId).first()

    console.log('Found order:', order)

    if (!order) {
      console.log('Creating new order for userId:', userId)
      // Create new order - Fixed column name
      const result = await c.env.DB.prepare(`
        INSERT INTO orders (user_id, checkout) VALUES (?, 0)
      `).bind(userId).run()
      
      console.log('Insert result:', result)
      order = { id: result.meta.last_row_id, user_id: userId, checkout: 0 }
    }

    // Get order items with product details - Fixed column names
    const orderItems = await c.env.DB.prepare(`
      SELECT 
        po.quantity,
        po.productId,
        p.name,
        p.price,
        p.id,
        p.image
      FROM product_orders po
      JOIN products p ON po.productId = p.id
      WHERE po.order_id = ?
      ORDER BY po.created_at DESC
    `).bind(order.id).all()

    console.log('Order items:', orderItems)

    return c.json({
      ...order,
      productOrders: orderItems.results || []
    })
  } catch (error) {
    console.error('Orders fetch error:', error)
    return c.json({ 
      error: 'Failed to fetch orders',
      details: error.message,
      stack: error.stack
    }, 500)
  }
})

// Add missing productOrders routes
app.post('/api/productOrders/:productId/:orderId', async (c) => {
  const productId = Number(c.req.param('productId'))
  const orderId = Number(c.req.param('orderId'))
  
  if (!productId || !orderId) {
    return c.json({ error: 'Invalid product or order ID' }, 400)
  }
  
  try {
    // Check if product order already exists
    const existing = await c.env.DB.prepare(`
      SELECT * FROM product_orders WHERE productId = ? AND order_id = ?
    `).bind(productId, orderId).first()

    if (existing) {
      // Update quantity
      await c.env.DB.prepare(`
        UPDATE product_orders SET quantity = quantity + 1 WHERE productId = ? AND order_id = ?
      `).bind(productId, orderId).run()
    } else {
      // Create new product order
      await c.env.DB.prepare(`
        INSERT INTO product_orders (productId, order_id, quantity) VALUES (?, ?, 1)
      `).bind(productId, orderId).run()
    }

    // Return updated product order
    const updated = await c.env.DB.prepare(`
      SELECT * FROM product_orders WHERE productId = ? AND order_id = ?
    `).bind(productId, orderId).first()

    return c.json(updated)
  } catch (error) {
    console.error('ProductOrder create error:', error)
    return c.json({ error: 'Failed to create product order', details: error.message }, 500)
  }
})

app.put('/api/productOrders/:productId/:orderId', async (c) => {
  const productId = Number(c.req.param('productId'))
  const orderId = Number(c.req.param('orderId'))
  
  try {
    const productOrder = await c.env.DB.prepare(`
      SELECT * FROM product_orders WHERE productId = ? AND order_id = ?
    `).bind(productId, orderId).first()

    if (!productOrder) {
      return c.json({ error: 'Product order not found' }, 404)
    }

    if (productOrder.quantity > 1) {
      await c.env.DB.prepare(`
        UPDATE product_orders SET quantity = quantity - 1 WHERE productId = ? AND order_id = ?
      `).bind(productId, orderId).run()
    }

    const updated = await c.env.DB.prepare(`
      SELECT * FROM product_orders WHERE productId = ? AND order_id = ?
    `).bind(productId, orderId).first()

    return c.json(updated)
  } catch (error) {
    console.error('ProductOrder update error:', error)
    return c.json({ error: 'Failed to update product order', details: error.message }, 500)
  }
})

app.delete('/api/productOrders/:productId/:orderId', async (c) => {
  const productId = Number(c.req.param('productId'))
  const orderId = Number(c.req.param('orderId'))
  
  try {
    await c.env.DB.prepare(`
      DELETE FROM product_orders WHERE productId = ? AND order_id = ?
    `).bind(productId, orderId).run()

    return c.json({ message: 'Product order deleted' })
  } catch (error) {
    console.error('ProductOrder delete error:', error)
    return c.json({ error: 'Failed to delete product order', details: error.message }, 500)
  }
})

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/debug-schema', async (c) => {
  try {
    const tables = await c.env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table'").all()
    const ordersSchema = await c.env.DB.prepare("PRAGMA table_info(orders)").all()
    
    return c.json({
      tables: tables.results,
      ordersSchema: ordersSchema.results
    })
  } catch (error) {
    return c.json({ error: error.message }, 500)
  }
})

app.get('/debug-all-schemas', async (c) => {
  try {
    const tablesResult = await c.env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '*cf*%'").all()
    const schemas = {}
    
    for (const table of tablesResult.results) {
      const schemaResult = await c.env.DB.prepare(`PRAGMA table_info(${table.name})`).all()
      schemas[table.name] = schemaResult.results
    }
    
    return c.json({ schemas })
  } catch (error) {
    return c.json({ error: error.message }, 500)
  }
})

// Test individual product route
app.get('/test-product/:id', async (c) => {
  const id = c.req.param('id')
  return c.json({ 
    message: `Testing product route with ID: ${id}`,
    timestamp: new Date().toISOString() 
  })
})
app.post('/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json()
    
    if (!email || !password) {
      return c.json({ error: 'Email and password required' }, 400)
    }

    // Find user by email
    const user = await c.env.DB.prepare(`
      SELECT id, email, password_hash FROM users WHERE email = ?
    `).bind(email).first()

    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // For now, we'll do a simple password check
    // In production, you'd use bcrypt or similar
    if (user.password_hash !== password) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // Return user data (without password)
    return c.json({
      id: user.id,
      email: user.email
    })
  } catch (error) {
    console.error('Login error:', error)
    return c.json({ error: 'Login failed', details: error.message }, 500)
  }
})

app.post('/auth/signup', async (c) => {
  try {
    const { email, password } = await c.req.json()
    
    if (!email || !password) {
      return c.json({ error: 'Email and password required' }, 400)
    }

    // Check if user already exists
    const existingUser = await c.env.DB.prepare(`
      SELECT id FROM users WHERE email = ?
    `).bind(email).first()

    if (existingUser) {
      return c.json({ error: 'User already exists' }, 409)
    }

    // Create new user
    // In production, hash the password with bcrypt
    const result = await c.env.DB.prepare(`
      INSERT INTO users (email, password_hash) VALUES (?, ?)
    `).bind(email, password).run()

    return c.json({
      id: result.meta.last_row_id,
      email: email
    })
  } catch (error) {
    console.error('Signup error:', error)
    return c.json({ error: 'Signup failed', details: error.message }, 500)
  }
})

app.get('/auth/me', async (c) => {
  // For now, return a mock user since we don't have session management
  // In production, you'd validate a JWT token or session
  return c.json({
    id: 1,
    email: 'demo@example.com'
  })
})

app.post('/auth/logout', async (c) => {
  // For now, just return success
  // In production, you'd invalidate the session/token
  return c.json({ message: 'Logged out successfully' })
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
      'POST /api/productOrders/:productId/:orderId': 'Add product to order',
      'PUT /api/productOrders/:productId/:orderId': 'Decrease product quantity in order',
      'DELETE /api/productOrders/:productId/:orderId': 'Remove product from order',
      'GET /init-db': 'Initialize database tables',
      'POST /seed-products': 'Seed initial products'
    }
  })
})

export default app


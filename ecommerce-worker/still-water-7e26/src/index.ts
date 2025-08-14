import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { sign, verify } from 'hono/jwt'

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
  created_at?: string
}

interface Order {
  id?: number
  user_id: number
  status?: string
  total?: number
  checkout?: number
  created_at?: string
  updated_at?: string
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
  JWT_SECRET: string // Add this to your environment variables
}

const app = new Hono<{ Bindings: Env }>()

// Enhanced CORS middleware
app.use('/*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  exposeHeaders: ['Content-Length'],
  credentials: true
}))

// Password hashing utilities using Web Crypto API
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const hashedPassword = await hashPassword(password)
  return hashedPassword === hash
}

// JWT utilities
async function generateToken(userId: number, email: string, secret: string): Promise<string> {
  const payload = {
    sub: userId.toString(),
    email: email,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7), // 7 days
    iat: Math.floor(Date.now() / 1000),
  }
  
  return await sign(payload, secret)
}

async function verifyToken(token: string, secret: string): Promise<any> {
  try {
    return await verify(token, secret)
  } catch (error) {
    return null
  }
}

// Auth middleware
async function authMiddleware(c: any, next: any) {
  const authHeader = c.req.header('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  
  const token = authHeader.substring(7)
  const payload = await verifyToken(token, c.env.JWT_SECRET)
  
  if (!payload) {
    return c.json({ error: 'Invalid token' }, 401)
  }
  
  // Check if token is expired
  if (payload.exp < Math.floor(Date.now() / 1000)) {
    return c.json({ error: 'Token expired' }, 401)
  }
  
  c.set('userId', parseInt(payload.sub))
  c.set('userEmail', payload.email)
  await next()
}

// Initialize database tables
app.get('/init-db', async (c) => {
  try {
    const results = []
    
    // Create users table with proper schema
    try {
      await c.env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `).run()
      results.push('Users table created')
    } catch (e: any) {
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
    } catch (e: any) {
      results.push(`Products table error: ${e.message}`)
    }

    // Create orders table
    try {
      await c.env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          checkout INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `).run()
      results.push('Orders table created')
    } catch (e: any) {
      results.push(`Orders table error: ${e.message}`)
    }

    // Create product_orders table
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
    } catch (e: any) {
      results.push(`Product orders table error: ${e.message}`)
    }

    // Create indexes for better performance
    await c.env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`).run()
    await c.env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)`).run()

    return c.json({ 
      message: 'Database initialization completed',
      details: results
    })
  } catch (error: any) {
    console.error('Database initialization error:', error)
    return c.json({ 
      error: 'Failed to initialize database',
      details: error.message 
    }, 500)
  }
})

// Auth endpoints
app.post('/auth/signup', async (c) => {
  try {
    const { email, password } = await c.req.json()
    
    // Validate input
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400)
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return c.json({ error: 'Invalid email format' }, 400)
    }
    
    // Password strength validation
    if (password.length < 6) {
      return c.json({ error: 'Password must be at least 6 characters long' }, 400)
    }
    
    // Check if user already exists
    const existingUser = await c.env.DB.prepare(`
      SELECT id FROM users WHERE email = ?
    `).bind(email.toLowerCase()).first()
    
    if (existingUser) {
      return c.json({ error: 'User already exists' }, 409)
    }
    
    // Hash password
    const passwordHash = await hashPassword(password)
    
    // Create new user
    const result = await c.env.DB.prepare(`
      INSERT INTO users (email, password_hash) VALUES (?, ?)
    `).bind(email.toLowerCase(), passwordHash).run()
    
    const userId = result.meta.last_row_id as number
    
    // Generate JWT token
    const token = await generateToken(userId, email.toLowerCase(), c.env.JWT_SECRET)
    
    return c.json({
      user: {
        id: userId,
        email: email.toLowerCase()
      },
      token
    })
  } catch (error: any) {
    console.error('Signup error:', error)
    return c.json({ error: 'Signup failed', details: error.message }, 500)
  }
})

app.post('/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json()
    
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400)
    }
    
    // Find user by email
    const user = await c.env.DB.prepare(`
      SELECT id, email, password_hash FROM users WHERE email = ?
    `).bind(email.toLowerCase()).first() as User | null
    
    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }
    
    // Verify password
    const isValid = await verifyPassword(password, user.password_hash!)
    
    if (!isValid) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }
    
    // Generate JWT token
    const token = await generateToken(user.id!, user.email, c.env.JWT_SECRET)
    
    return c.json({
      user: {
        id: user.id,
        email: user.email
      },
      token
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return c.json({ error: 'Login failed', details: error.message }, 500)
  }
})

app.get('/auth/me', authMiddleware, async (c) => {
  const userId = c.get('userId')
  const userEmail = c.get('userEmail')
  
  try {
    // Get fresh user data from database
    const user = await c.env.DB.prepare(`
      SELECT id, email, created_at FROM users WHERE id = ?
    `).bind(userId).first()
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }
    
    return c.json({
      id: user.id,
      email: user.email,
      created_at: user.created_at
    })
  } catch (error: any) {
    console.error('Get user error:', error)
    return c.json({ error: 'Failed to get user data' }, 500)
  }
})

app.post('/auth/logout', (c) => {
  // With JWT, logout is handled client-side by removing the token
  // This endpoint is kept for consistency
  return c.json({ message: 'Logged out successfully' })
})

// Products API (public endpoints)
app.get('/api/products', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT name, image, price, id 
      FROM products 
      WHERE inventory > 0 
      ORDER BY year ASC, name ASC
    `).all()

    return c.json(results)
  } catch (error: any) {
    console.error('Products fetch error:', error)
    return c.json({ error: 'Failed to fetch products', details: error.message }, 500)
  }
})

app.get('/api/products/:id', async (c) => {
  const id = c.req.param('id')
  
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
  } catch (error: any) {
    console.error('Product fetch error:', error)
    return c.json({ error: 'Failed to fetch product', details: error.message }, 500)
  }
})

// Orders API - Works with or without authentication
app.get('/api/orders', async (c) => {
  // Check if user is authenticated
  const authHeader = c.req.header('Authorization')
  let userId = null
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    const payload = await verifyToken(token, c.env.JWT_SECRET)
    if (payload) {
      userId = parseInt(payload.sub)
    }
  }
  
  try {
    if (userId) {
      // Authenticated user - get their saved order
      let order = await c.env.DB.prepare(`
        SELECT * FROM orders WHERE user_id = ? AND checkout = 0
      `).bind(userId).first() as Order | null

      if (!order) {
        // Create new order for authenticated user
        const result = await c.env.DB.prepare(`
          INSERT INTO orders (user_id, checkout) VALUES (?, 0)
        `).bind(userId).run()
        
        order = { 
          id: result.meta.last_row_id as number, 
          user_id: userId, 
          checkout: 0 
        }
      }

      // Get order items with product details
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
      `).bind(order.id!).all()

      return c.json({
        ...order,
        productOrders: orderItems.results || []
      })
    } else {
      // Guest user - return empty cart structure
      // The frontend will manage the cart in local storage
      return c.json({
        id: null,
        user_id: null,
        checkout: 0,
        productOrders: [],
        isGuest: true
      })
    }
  } catch (error: any) {
    console.error('Orders fetch error:', error)
    return c.json({ 
      error: 'Failed to fetch orders',
      details: error.message
    }, 500)
  }
})

// Product Order endpoints - Work with or without authentication
app.post('/api/productOrders/:productId/:orderId', async (c) => {
  const productId = Number(c.req.param('productId'))
  const orderId = Number(c.req.param('orderId'))
  
  // Check if user is authenticated
  const authHeader = c.req.header('Authorization')
  let userId = null
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    const payload = await verifyToken(token, c.env.JWT_SECRET)
    if (payload) {
      userId = parseInt(payload.sub)
    }
  }
  
  if (!productId) {
    return c.json({ error: 'Invalid product ID' }, 400)
  }
  
  try {
    if (userId && orderId) {
      // Authenticated user - save to database
      // Verify the order belongs to the user
      const order = await c.env.DB.prepare(`
        SELECT * FROM orders WHERE id = ? AND user_id = ?
      `).bind(orderId, userId).first()
      
      if (!order) {
        return c.json({ error: 'Order not found or unauthorized' }, 404)
      }
      
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
    } else {
      // Guest user - just return success, frontend manages cart
      return c.json({
        productId,
        quantity: 1,
        isGuest: true
      })
    }
  } catch (error: any) {
    console.error('ProductOrder create error:', error)
    return c.json({ error: 'Failed to create product order', details: error.message }, 500)
  }
})

app.put('/api/productOrders/:productId/:orderId', async (c) => {
  const productId = Number(c.req.param('productId'))
  const orderId = Number(c.req.param('orderId'))
  
  // Check if user is authenticated
  const authHeader = c.req.header('Authorization')
  let userId = null
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    const payload = await verifyToken(token, c.env.JWT_SECRET)
    if (payload) {
      userId = parseInt(payload.sub)
    }
  }
  
  try {
    if (userId && orderId) {
      // Authenticated user - update in database
      const order = await c.env.DB.prepare(`
        SELECT * FROM orders WHERE id = ? AND user_id = ?
      `).bind(orderId, userId).first()
      
      if (!order) {
        return c.json({ error: 'Order not found or unauthorized' }, 404)
      }
      
      const productOrder = await c.env.DB.prepare(`
        SELECT * FROM product_orders WHERE productId = ? AND order_id = ?
      `).bind(productId, orderId).first() as ProductOrder | null

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
    } else {
      // Guest user - just return success
      return c.json({
        productId,
        isGuest: true
      })
    }
  } catch (error: any) {
    console.error('ProductOrder update error:', error)
    return c.json({ error: 'Failed to update product order', details: error.message }, 500)
  }
})

app.delete('/api/productOrders/:productId/:orderId', async (c) => {
  const productId = Number(c.req.param('productId'))
  const orderId = Number(c.req.param('orderId'))
  
  // Check if user is authenticated
  const authHeader = c.req.header('Authorization')
  let userId = null
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    const payload = await verifyToken(token, c.env.JWT_SECRET)
    if (payload) {
      userId = parseInt(payload.sub)
    }
  }
  
  try {
    if (userId && orderId) {
      // Authenticated user - delete from database
      const order = await c.env.DB.prepare(`
        SELECT * FROM orders WHERE id = ? AND user_id = ?
      `).bind(orderId, userId).first()
      
      if (!order) {
        return c.json({ error: 'Order not found or unauthorized' }, 404)
      }
      
      await c.env.DB.prepare(`
        DELETE FROM product_orders WHERE productId = ? AND order_id = ?
      `).bind(productId, orderId).run()
    }
    
    // For both guest and authenticated users
    return c.json({ message: 'Product order deleted' })
  } catch (error: any) {
    console.error('ProductOrder delete error:', error)
    return c.json({ error: 'Failed to delete product order', details: error.message }, 500)
  }
})

// Product inventory management - PUBLIC (no auth required for viewing)
app.put('/api/products/:id/minus', async (c) => {
  const id = c.req.param('id')
  
  if (!id || isNaN(Number(id))) {
    return c.json({ error: 'Invalid product ID' }, 400)
  }
  
  try {
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
      
      const updatedProduct = await c.env.DB.prepare(`
        SELECT name, image, description, price, inventory, id, songs, year
        FROM products WHERE id = ?
      `).bind(Number(id)).first()
      
      return c.json(updatedProduct)
    }

    return c.json(product)
  } catch (error: any) {
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
  } catch (error: any) {
    console.error('Product update error:', error)
    return c.json({ error: 'Failed to update product', details: error.message }, 500)
  }
})

// Seed products endpoint (for development)
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
  } catch (error: any) {
    console.error('Seeding error:', error)
    return c.json({ error: 'Failed to seed products' }, 500)
  }
})

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Default route
app.get('/', (c) => {
  return c.json({ 
    message: 'Billy Bass E-commerce API with JWT Auth',
    endpoints: {
      auth: {
        'POST /auth/signup': 'Create new account',
        'POST /auth/login': 'Login with email/password',
        'GET /auth/me': 'Get current user (requires auth)',
        'POST /auth/logout': 'Logout'
      },
      products: {
        'GET /api/products': 'List all products (public)',
        'GET /api/products/:id': 'Get product by ID (public)',
        'PUT /api/products/:id/minus': 'Decrease inventory (public)',
        'PUT /api/products/:id/plus': 'Increase inventory (public)'
      },
      orders: {
        'GET /api/orders': 'Get cart (works for guests and authenticated users)',
        'POST /api/productOrders/:productId/:orderId': 'Add to cart (works for guests and authenticated users)',
        'PUT /api/productOrders/:productId/:orderId': 'Decrease quantity (works for guests and authenticated users)',
        'DELETE /api/productOrders/:productId/:orderId': 'Remove from cart (works for guests and authenticated users)'
      },
      setup: {
        'GET /init-db': 'Initialize database tables',
        'POST /seed-products': 'Seed initial products'
      }
    }
  })
})

export default app
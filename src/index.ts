import express, { json, urlencoded } from 'express'
import categoriesRoutes from './routes/categories/index.js'
import ordersRoutes from './routes/orders/index.js'
import productRoutes from './routes/products/index.js'
import 'dotenv/config'

const port = 3000

const app = express()
app.use(urlencoded({ extended: false }))
app.use(json())

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.use('/products', productRoutes)
app.use('/orders', ordersRoutes)
app.use('/categories', categoriesRoutes)
app.get('/debug', (req, res) => {
  res.json({ DATABASE_URL: process.env.DATABASE_URL })
})

app.listen(port, () => {
  console.log(`Server have stated with port ${port}`)
})

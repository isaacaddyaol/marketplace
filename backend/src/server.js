require('dotenv').config();
const express = require('express');
const cors = require('cors');
// ... other route imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const orderRoutes = require('./routes/orderRoutes'); // Added

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/orders', orderRoutes); // Added

// ... (rest of server.js: default route, port listening)
app.get('/', (req, res) => {
  res.send('Handmade Crafts Marketplace API Running!');
});
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

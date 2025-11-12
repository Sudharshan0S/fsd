//backend/package.json
{
"name": "fullstack-shop-backend",
"version": "1.0.0",
"main": "server.js",
"scripts": {
"start": "node server.js",
"dev": "nodemon server.js"
},
“type”:”module”,
"dependencies": {
"cors": "^2.8.5",
"dotenv": "^16.0.0",
"express": "^4.18.2",
"mongoose": "^7.0.0"
},
"devDependencies": {
"nodemon": "^2.0.20"
}
}



//backend/models/Product.js
const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
name: { type: String, required: true },
description: String,
price: { type: Number, required: true },
inStock: { type: Boolean, default: true },
createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Product', ProductSchema);



//backend/routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
// GET /products - fetch all products
router.get('/', async (req, res) => {
try {
const products = await Product.find().sort({ createdAt: -1 }).lean();
res.json(products);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Server error' });
}
});
// POST /products - add a new product
router.post('/', async (req, res) => {
try {
const { name, description, price, inStock } = req.body;
const product = new Product({ name, description, price, inStock });
await product.save();
res.status(201).json(product);
} catch (err) {
console.error(err);
res.status(400).json({ error: 'Invalid data' });
}
});
// PUT /products/:id - update a product
router.put('/:id', async (req, res) => {
try {
const { id } = req.params;
const update = req.body;
const product = await Product.findByIdAndUpdate(id, update, { new: true });
if (!product) return res.status(404).json({ error: 'Not found' });
res.json(product);
} catch (err) {
console.error(err);
res.status(400).json({ error: 'Invalid request' });
}
});
// DELETE /products/:id - delete a product
router.delete('/:id', async (req, res) => {
try {
const { id } = req.params;
const removed = await Product.findByIdAndDelete(id);
if (!removed) return res.status(404).json({ error: 'Not found' });
res.json({ message: 'Deleted' });
} catch (err) {
console.error(err);
res.status(400).json({ error: 'Invalid request' });
}
});
module.exports = router;




//backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productsRouter = require('./routes/products');
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json()); // parse JSON bodies
// mount routes
app.use('/products', productsRouter);
// connect mongoose
async function start() {
try {
await mongoose.connect(process.env.MONGO_URI, {
useNewUrlParser: true,
useUnifiedTopology: true
});
console.log('Connected to MongoDB via Mongoose');
app.listen(port, () => {
console.log(`Server listening on http://localhost:${port}`);
});
} catch (err) {
console.error('Failed to connect to MongoDB', err);
process.exit(1);
}
}
start();




//backend/db-native.js
// run: node db-native.js
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);
async function run() {
try {
await client.connect();
console.log('Connected to MongoDB (native driver)');
const db = client.db('shop');
const products = db.collection('products');
// Insert a document
const insertResult = await products.insertOne({
name: 'Native Driver Sample',
description: 'Inserted with native driver',
price: 9.99,
inStock: true,
createdAt: new Date()
});
console.log('Inserted id:', insertResult.insertedId);
// Find documents
const found = await products.find({}).limit(5).toArray();
console.log('Found', found.length, 'products');
// Update one
const idToUpdate = insertResult.insertedId;
await products.updateOne({ _id: idToUpdate }, { $set: { price: 7.99 } });
console.log('Updated price for id', idToUpdate.toHexString());
// Delete one
await products.deleteOne({ _id: idToUpdate });
console.log('Deleted doc', idToUpdate.toHexString());
} catch (err) {
console.error(err);
} finally {
await client.close();
}
}
run();


//Frontend — React
//Create a React app
//>npx create-react-app frontend
//>cd frontend
//>npm start



//frontend/src/App.js
import React from 'react';
import ProductList from './ProductList.js';
import ProductForm from './ProductForm'.js;
function App() {
return (
<div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
<h1>Product Manager</h1>
<ProductForm />
<hr />
<ProductList />
</div>
);
}
export default App;



//frontend/src/ProductList.js
import React, { useEffect, useState } from 'react';
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
export default function ProductList() {
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
async function fetchProducts() {
setLoading(true);
try {
const res = await fetch(`${API}/products`);
const data = await res.json();
setProducts(data);
} catch (err) {
console.error('Failed to fetch products', err);
} finally {
setLoading(false);
}
}
useEffect(() => {
fetchProducts();
}, []);
// delete handler
async function handleDelete(id) {
if (!window.confirm('Delete this product?')) return;
try {
const res = await fetch(`${API}/products/${id}`, { method: 'DELETE' });
if (res.ok) {
setProducts((p) => p.filter(x => x._id !== id));
} else {
console.error('Delete failed');
}
} catch (err) {
console.error(err);
}
}
return (<div>
<h2>Products</h2>
{loading ? <p>Loading...</p> : null}
{products.length === 0 && !loading ? <p>No products yet.</p> : null}
<ul>
{products.map(p => (
<li key={p._id} style={{ marginBottom: 8 }}>
<strong>{p.name}</strong> — ₹{p.price} {p.inStock ? '(In stock)' : '(Out of stock)'}
<div style={{ fontSize: 12 }}>{p.description}</div>
<button onClick={() => handleDelete(p._id)} style={{ marginTop: 6 }}>
Delete
</button>
</li>
))}
</ul>
<button onClick={fetchProducts}>Refresh</button>
</div>
);
}




//frontend/src/ProductForm.js
import React, { useState } from 'react';
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
export default function ProductForm() {
const [name, setName] = useState('');
const [desc, setDesc] = useState('');
const [price, setPrice] = useState('');
const [inStock, setInStock] = useState(true);
const [status, setStatus] = useState(null);async function handleSubmit(e) {
e.preventDefault();
setStatus('Saving...');
const payload = {
name,
description: desc,
price: parseFloat(price) || 0,
inStock
};
try {
const res = await fetch(`${API}/products`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(payload)
});
if (!res.ok) throw new Error('Failed to create');
const created = await res.json();
setStatus('Created.');
// clear inputs
setName('');
setDesc('');
setPrice('');
// Option A: emit an event (simple approach: dispatch custom event so ProductList can refetch)
window.dispatchEvent(new CustomEvent('product:created', { detail: created }));
// Option B: re-fetch from ProductList by letting user click refresh (we used event)
} catch (err) {
console.error(err);
setStatus('Failed to create');
} finally {
setTimeout(() => setStatus(null), 2000);
}
}
return (
<form onSubmit={handleSubmit}>
<h2>Add Product</h2>
<div>
<label>Name</label><br/>
<input value={name} onChange={e => setName(e.target.value)} required />
</div>
<div>
<label>Description</label><br/>
<input value={desc} onChange={e => setDesc(e.target.value)} />
</div>
<div>
<label>Price</label><br/>
<input value={price} onChange={e => setPrice(e.target.value)} type="number" step="0.01"
required />
</div>
<div>
<label>
<input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} />
In stock
</label>
</div>
<button type="submit">Add</button>
{status && <div>{status}</div>}
</form>
);
}

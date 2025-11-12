//server.js
import express from "express";
import products from "./product.js";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import cors from "cors";
const app = express();
const PORT = 4000;
// Middleware
app.use(express.json());
app.use((req, res, next) => {
 console.log(`${req.method} ${req.url}`);
 next();
});
app.use(cors());
// REST API Endpoints
// Root endpoint
app.get("/", (req, res) => {
 res.send("Hello, Express!");
});
// Get all products
app.get("/products", (req, res) => {
 res.json(products);
});
// Get a single product by ID
app.get("/products/:id", (req, res) => {
 const product = products.find(p => p.id === parseInt(req.params.id));
 if (!product) return res.status(404).json({ error: "Product not found" });
 res.json(product);
});
// Add a new product
app.post("/products", (req, res) => {
 const newProduct = {
 id: products.length + 1,
 ...req.body
 };
 products.push(newProduct);
 res.status(201).json(newProduct);
});
// Update a product
app.put("/products/:id", (req, res) => {
const product = products.find(p => p.id === parseInt(req.params.id));
 if (!product) return res.status(404).json({ error: "Product not found" });
 Object.assign(product, req.body);
 res.json(product);
});
// Delete a product
app.delete("/products/:id", (req, res) => {
 const index = products.findIndex(p => p.id === parseInt(req.params.id));
 if (index === -1) return res.status(404).json({ error: "Product not found" });
 const deleted = products.splice(index, 1);
 res.json(deleted[0]);
});
// Start Express server
app.listen(PORT, () => console.log(`REST API running on http://localhost:${PORT}`));
// --- GraphQL Setup ---
const typeDefs = `#graphql
 type Product {
 id: Int
 name: String
 price: Float
 }

type Query {
 products: [Product]
 product(id: Int!): Product
 }
 type Mutation {
 addProduct(name: String!, price: Float!): Product
 updateProduct(id: Int!, name: String, price: Float): Product
 deleteProduct(id: Int!): Product
 }
`;
const resolvers = {
 Query: {
 products: () => products,
 product: (_, { id }) => products.find(p => p.id === id)
 },
 Mutation: {
 addProduct: (_, { name, price }) => {
 const newProduct = { id: products.length + 1, name, price };
 products.push(newProduct);
 return newProduct;
 },
updateProduct: (_, { id, name, price }) => {
 const product = products.find(p => p.id === id);
 if (!product) return null;
 if (name !== undefined) product.name = name;
 if (price !== undefined) product.price = price;
 return product;
 },
 deleteProduct: (_, { id }) => {
 const index = products.findIndex(p => p.id === id);
 if (index === -1) return null;
 return products.splice(index, 1)[0];
 }
 }
};
async function startGraphQL() {
 const server = new ApolloServer({ typeDefs, resolvers });
 const { url } = await startStandaloneServer(server, { listen: { port: 5000 } });
 console.log(`GraphQL API running at ${url}`);
}
startGraphQL();




//Product.js

let products = [
 { id: 1, name: "Laptop", price: 1000 },
 { id: 2, name: "Phone", price: 500 }
 ]; 
 export default products;



//Package.json
{
 "name": "exp7-api",
 "version": "1.0.0",
 "description": "REST and GraphQL API for Products",
 "main": "server.js",
 "type": "module",
 "scripts": {
 "start": "node server.js"
 },
 "dependencies": {
 "express": "^4.18.2",
 "graphql": "^16.7.1",
 "@apollo/server": "^4.12.0",
 "cors": "^2.8.5"
 }
}



//Step5: Run and Test

node server.js


//Step6:
 REST API: http://localhost:4000
 GraphQL API: http://localhost:5000

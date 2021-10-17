const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const usersCtrl = require('./routes/users');
const productsCtrl = require('./routes/products');
const cartCtrl = require('./routes/carts');
require('dotenv/config');

const server = express();

// Middlewares
server.use(cors());
server.use(bodyParser.json());

// Define routes
server.use('/api/users', usersCtrl);
server.use('/api/products', productsCtrl);
server.use("/api/cart", cartCtrl);

// Connect to mongodb
mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser: true}, ()=>{
    console.log('successfully connected to database');
});

// start server on port=4000
server.listen(4000, ()=>{
    console.log('Server started on http://localhost:4000');
});
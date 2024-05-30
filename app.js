require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const NodeCache = require("node-cache"); // You need to install this package
const app = express();
const port = process.env.PORT || 3000;
const deviceRoutes = require('./routes/deviceRoutes');

const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 }); // TTL in seconds
const mongoDB = process.env.MONGODB_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

app.use(express.json());

// Middleware to check cache
app.use((req, res, next) => {
  const key = `${req.method}_${req.originalUrl}`;
  if (myCache.has(key)) {
    console.log('Cache hit');
    return res.json(myCache.get(key));
  }
  console.log('Cache miss');
  // Pass a reference to the cache and the key to the next middleware
  res.locals.cache = myCache;
  res.locals.cacheKey = key;
  next();
});

app.use('/devices', deviceRoutes);

app.get('/', (req, res) => {
  // Example of caching root path
  const key = 'GET_/';
  if (res.locals.cache.has(key)) {
    return res.json(res.locals.cache.get(key));
  }

  const data = { message: 'Welcome to the IoT Home Automation System' };

  res.locals.cache.set(key, data);
  res.json(data);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
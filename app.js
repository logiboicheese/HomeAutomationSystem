require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const NodeCache = require("node-cache");
const app = express();
const port = process.env.PORT || 3000;
const deviceRoutes = require('./routes/deviceRoutes');

const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 }); // TTL in seconds
const mongoDB = process.env.MONGODB_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

app.use(express.json());

const cacheMiddleware = (req, res, next) => {
  const key = `${req.method}_${req.originalUrl}`;
  const cachedResponse = myCache.get(key);
  if (cachedResponse) {
    console.log('Cache hit');
    return res.json(cachedResponse);
  }
  console.log('Cache miss');
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    myCache.set(key, body);
    originalJson(body);
  };
  next();
};

app.use(cacheMiddleware);

app.use('/devices', deviceRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the IoT Home Automation System' });
});

app.get('/heavy-calculation', (req, res) => {
  performHeavyCalculation()
    .then(result => res.json(result))
    .catch(err => res.status(500).send(err.message));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function performHeavyCalculation() {
  return Promise.resolve({ result: "Calculation result" });
}
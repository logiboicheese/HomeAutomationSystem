require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const NodeCache = require("node-cache");
const app = express();
const port = process.env.PORT || 3000;
const deviceRoutes = require('./routes/deviceRoutes');

const appCache = new NodeCache({ stdTTL: 100, checkperiod: 120 }); // TTL in seconds
const mongoDBUri = process.env.MONGODB_URI;

mongoose.connect(mongoDBUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

app.use(express.json());

const cacheInterceptorMiddleware = (req, res, next) => {
  const cacheKey = `${req.method}_${req.originalUrl}`;
  const cachedResult = appCache.get(cacheKey);
  if (cachedResult) {
    console.log('Cache hit');
    return res.json(cachedResult);
  }
  console.log('Cache miss');
  const originalSendResponse = res.json.bind(res);
  res.json = (body) => {
    appCache.set(cacheKey, body);
    originalSendResponse(body);
  };
  next();
};

app.use(cacheInterceptorMiddleware);

app.use('/devices', deviceRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the IoT Home Automation System' });
});

app.get('/perform-intensive-task', (req, res) => {
  calculateIntensiveTaskResult()
    .then(result => res.json(result))
    .catch(err => res.status(500).send(err.message));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function calculateIntensiveTaskResult() {
  return Promise.resolve({ result: "Intensive task calculation result" });
}
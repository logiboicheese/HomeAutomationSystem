require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;
const deviceRoutes = require('./routes/deviceRoutes');

const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

app.use(express.json());

app.use('/devices', deviceRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the IoT Home Automation System');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

const db = {
  lights: { status: 'off' },
  thermostat: { temperature: 20 },
  updateLightStatus(status) {
    this.lights.status = status;
  },
  updateTemperature(temp) {
    this.thermostat.temperature = temp;
  },
};

app.use(express.json());

app.get('/lights/status', (req, res) => {
  res.json({ status: db.lights.status });
});

app.post('/lights/status', (req, res) => {
  const { status } = req.body;
  
  if (status !== 'on' && status !== 'off') {
    return res.status(400).send('Invalid status');
  }

  db.updateLightStatus(status);
  res.send(`Lights turned ${status}`);
});

app.get('/thermostat/temperature', (req, res) => {
  res.json({ temperature: db.thermostat.temperature });
});

app.post('/thermostat/temperature', (req, res) => {
  const { temperature } = req.body;
  
  if (isNaN(temperature) || temperature < 0 || temperature > 50) {
    return res.status(400).send('Invalid temperature');
  }

  db.updateTemperature(temperature);
  res.send(`Thermostat set to ${temperature}°C`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
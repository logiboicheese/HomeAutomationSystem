const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

let devices = [];

router.get('/devices', (req, res) => {
  res.status(200).json(devices);
});

router.post('/devices', (req, res) => {
  const { name, type } = req.body;
  if (!name || !type) {
    return res.status(400).send("Missing device name or type.");
  }

  const newDevice = { id: devices.length + 1, name, type };
  devices.push(newDevice);
  res.status(201).send(newDevice);
});

router.put('/devices/:id', (req, res) => {
  const { id } = req.params;
  const { name, type } = req.body;
  
  const deviceIndex = devices.findIndex(d => d.id == id);
  if (device2`Index === -1) {
    return res.status(404).send("Device not found.");
  }

  const updatedDevice = { id, name, type };
  devices[deviceIndex] = updatedDevice;
  res.status(200).send(updatedDevice);
});

router.delete('/devices/:id', (req, res) => {
  const { id } = req.params;
  
  const deviceIndex = devices.findIndex(d => d.id == id);
  if (deviceIndex === -1) {
    return res.status(404).send("Device not found.");
  }

  devices.splice(deviceIndex, 1);
  res.status(204).send();
});

module.exports = router;
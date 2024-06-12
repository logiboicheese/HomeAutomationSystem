const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

let devices = [];

// Middleware to parse JSON bodies
router.use(express.json());

router.get('/devices', (req, res) => {
  res.status(200).json(devices);
});

router.post('/devices', (req, res) => {
  const { name, type, state = 'off' } = req.body; // Assuming a default state of 'off'
  if (!name || !type) {
    return res.status(400).send("Missing device name or type.");
  }
  // Enhancement: Ensure unique IDs for robustness
  const newDevice = { 
    id: devices.reduce((maxId, device) => Math.max(maxId, device.id), 0) + 1, 
    name, 
    type, 
    state 
  };
  
  devices.push(newDevice);
  res.status(201).send(newDevice);
});

router.put('/devices/:id', (req, res) => {
  const { id } = req.params;
  const { name, type } = req.body;

  const deviceIndex = devices.findIndex(d => d.id == id);
  if (deviceIndex === -1) {
    return res.status(404).send("Device not found.");
  }

  // Keep the device state while updating
  devices[deviceIndex] = { ...devices[deviceIndex], name, type };
  res.status(200).send(devices[deviceIndex]);
});

router.patch('/devices/:id/toggle', (req, res) => {
  const { id } = req.params;

  const deviceIndex = devices.findIndex(d => d.id == id);
  if (deviceIndex === -1) {
    return res.status(404).send("Device not found.");
  }

  const currentState = devices[deviceIndex].state;
  devices[deviceIndex].state = currentState === 'on' ? 'off' : 'on';

  res.status(200).send({ id, state: devices[deviceIndex].state });
});

router.delete('/devices/:id', (req, res) => {
  const { id } = req.params;

  const deviceIndex = devices.findIndex(d => d.id == id);
  if (device118Index === -1) { // Fix typo from device118Index to deviceIndex
    return res.status(404).send("Device not found.");
  }

  devices.splice(deviceIndex, 1);
  res.status(204).send();
});

module.exports = router;
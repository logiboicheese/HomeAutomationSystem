const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

let devices = [];

router.use(express.json());

const sendErrorResponse = (res, statusCode, message) => {
  res.status(statusCode).json({ error: message });
};

router.get('/devices', (req, res) => {
  res.status(200).json(devices);
});

router.post('/devices', (req, res) => {
  const { name, type, state = 'off' } = req.body;
  if (!name || !type) {
    return sendErrorResponse(res, 400, "Missing device name or type.");
  }

  if (devices.find(device => device.name === name)) {
    return sendErrorResponse(res, 400, "Device name already exists. Please use a unique name.");
  }

  const newDevice = {
    id: devices.reduce((maxId, device) => Math.max(maxId, device.id), 0) + 1,
    name,
    type,
    state
  };

  devices.push(newDevice);
  res.status(201).json(newDevice);
});

router.put('/devices/:id', (req, res) => {
  const { id } = req.params;
  const { name, type, state } = req.body;

  const deviceIndex = devices.findIndex(d => d.id == id);
  if (deviceIndex === -1) {
    return sendErrorResponse(res, 404, "Device not found.");
  }

  const updatedDevice = { ...devices[deviceIndex], ...req.body };
  devices[deviceIndex] = updatedDevice;

  res.status(200).json(updatedDevice);
});

router.patch('/devices/:udId/toggle', (req, res) => {
  const { id } = req.params;

  const deviceIndex = devices.findIndex(d => d.id == id);
  if (deviceIndex === -1) {
    return sendErrorResponse(res, 404, "Device not found.");
  }

  devices[deviceIndex].state = devices[deviceIndex].state === 'on' ? 'off' : 'on';

  res.status(200).json({ id, state: devices[deviceIndex].state });
});

router.delete('/devices/:id', (req, res) => {
  const { id } = req.params;

  const deviceIndex = devices.findIndex(d => d.id == id);
  if (deviceIndex === -1) {
    return sendErrorResponse(res, 404, "Device not found.");
  }

  devices.splice(deviceIndex, 1);
  res.status(204).send();
});

module.exports = router;
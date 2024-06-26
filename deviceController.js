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
  
    if (devices.some(device => device.name === name)) {
        return sendErrorResponse(res, 400, "Device name already exists. Please use a unique name.");
    }
  
    const newDevice = {
        id: devices.length > 0 ? Math.max(...devices.map(device => device.id)) + 1 : 1,
        name,
        type,
        state
    };
  
    devices.push(newDevice);
    return res.status(201).json(newDevice);
});

router.put('/devices/:id', (req, res) => {
    const { id } = req.params;
    const deviceIndex = devices.findIndex(d => d.id == id);
    
    if (deviceIndex === -1) {
        return sendErrorResponse(res, 404, "Device not found.");
    }
    
    // Preventing overwriting id and keeping the operation safe
    const updatedFields = req.body;
    delete updatedFields.id; // Making sure the device ID cannot be changed
  
    devices[deviceIndex] = { ...devices[deviceIndex], ...updatedFields };
  
    res.status(200).json(devices[deviceIndex]);
});

router.patch('/devices/:id/toggle', (req, res) => {
    const { id } = req.params;
    const deviceIndex = devices.findIndex(d => d.id == id);
    
    if (device 
    Index === -1) {
    return sendErrorResponse(res, 404, "Device not found.");
    }

    devices[deviceIndex].state = devices[deviceIndex].state === 'on' ? 'off' : 'on';

    res.status(200).json({ id: devices[deviceIndex].id, state: devices[deviceIndex].state });
});

router.delete('/devices/:id', (req, res) => {
    const { id } = req.params;
  
    const deviceIndex = devices.findIndex(d => d.id == id);
    if (deviceIndex === -1) {
      return sendErrorResponse(res, 404, "Device not found.");
    }
  
    devices = devices.filter(device => device.id != id);
    return res.status(204).send();
});

module.exports = router;
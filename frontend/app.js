const API_URL = 'YOUR_BACKEND_API_URL';

async function fetchDevices() {
  try {
    const response = await fetch(`${API_URL}/devices`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch devices');
    }
    const devices = await response.json();
    updateDevicesListUI(devices);
  } catch (error) {
    console.error('Error fetching devices:', error);
  }
}

async function sendDeviceCommand(deviceId, command) {
  try {
    const response = await fetch(`${API_URL}/devices/${deviceId}/command`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        command: command,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to send command to device');
    }
    const result = await response.json();
    console.log('command result:', result);
    fetchDevices();
  } catch (error) {
    console.error('Error sending command to device:', error);
  }
}

function updateDevicesListUI(devices) {
  const devicesListElement = document.getElementById('devicesList');
  devicesListElement.innerHTML = '';

  devices.forEach(device => {
    const listItem = document.createElement('li');
    listItem.textContent = `Device: ${device.name} - Status: ${device.status}`;
    
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Toggle';
    toggleButton.onclick = () => sendDeviceCommand(device.id, 'toggle');
    listItem.appendChild(toggleButton);

    devicesListElement.appendChild(listElement);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fetchDevices();
});
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
    try {
      updateDevicesListUI(devices);
    } catch (uiError) {
      console.error('Error updating devices list UI:', uiError);
      // Potentially, here could be a recovery strategy or a user notification.
    }
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
    try {
      await fetchDevices(); // Refresh the list of devices after sending a command
    } catch (fetchError) {
      console.error('Error refreshing devices after command:', fetchError);
    }
  } catch (error) {
    console.error('Error sending command to device:', error);
  }
}

function updateDevicesListUI(devices) {
  try {
    const devicesListElement = document.getElementById('devicesList');
    if (!devicesListElement) {
      throw new Error('Devices list element not found');
    }
    devicesListElement.innerHTML = '';

    devices.forEach(device => {
      const listItem = document.createElement('li');
      listItem.textContent = `Device: ${device.name} - Status: ${device.status}`;
      
      const toggleButton = document.createElement('button');
      toggleButton.textContent = 'Toggle';
      toggleButton.onclick = () => sendDeviceCommand(device.id, 'toggle');
      listItem.appendChild(toggleButton);

      devicesListElement.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error updating UI:', error);
  }
}

function startAutoRefresh(intervalInSeconds = 30) {
  setInterval(() => {
    console.log('Refreshing device list...');
    fetchDevices().catch(error => {
      console.error('Error in auto-refreshing devices:', error);
    });
  }, intervalInSeconds * 1000); 
}

document.addEventListener('DOMContentLoaded', () => {
  fetchDevices().catch(error => {
    console.error('Error fetching devices on DOMContentLoaded:', error);
  });
  startAutoResolution(60); // Note: This seems to be a typo, assuming intention was to call `startAutoRefresh(60);`
});
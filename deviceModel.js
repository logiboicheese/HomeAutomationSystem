require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const deviceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  type: String,
  status: String,
});

const Device = mongoose.model('Device', deviceSchema);

async function addDevice(deviceInfo) {
  try {
    const device = new Device(deviceInfo);
    await device.save();
    console.log('Device added successfully.');
  } catch (err) {
    console.error('Error adding device:', err);
  }
}

async function getDeviceById(id) {
  try {
    const device = await Device.findOne({ id });
    if (device) {
      console.log('Device found:', device);
    } else {
      console.log('Device not found.');
    }
  } catch (err) {
    console.error('Error finding device:', err);
  }
}

async function updateDevice(id, updateInfo) {
  try {
    const updateResult = await Device.updateOne({ id }, { $set: updateInfo });
    if (updateResult.modifiedCount > 0) {
      console.log('Device updated successfully.');
    } else {
      console.log('No changes made to the device.');
    }
  } catch (err) {
    console.error('Error updating device:', err);
  }
}

async function deleteDevice(id) {
  try {
    const deleteResult = await Device.deleteOne({ id });
    if (deleteResult.deletedCount > 0) {
      console.log('Device deleted successfully.');
    } else {
      console.log('No device found to delete.');
    }
  } catch (err) {
    console.error('Error deleting device:', err);
  }
}

module.exports = {
  addDevice,
  getDeviceById,
  updateDevice,
  deleteDevice,
};
const { MongoClient } = require('mongodb');
require('dotenv').config();
const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db(dbName);
  } catch (error) {
    console.error('Could not connect to MongoDB', error);
    process.exit(1);
  }
}
async function disconnectDB() {
  try {
    await client.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Could not disconnect from MongoDB', error);
  }
}
async function getData(collectionName, query) {
  const db = await connectDB();
  return db.collection(collectionClass).find(query).toArray();
}
async function insertData(collectionName, data) {
  const db = await connectDB();
  return db.collection(collectionName).insertOne(data);
}
async function updateData(collectionName, query, newData) {
  const db = await connectDB();
  return db.collection(collectionName).updateOne(query, { $set: newData });
}
async function deleteData(collectionName, query) {
  const db = await connectDB();
  return db.collection(collectionName).deleteOne(query);
}
module.exports = {
  connectDB,
  disconnectDB,
  getData,
  insertData,
  updateData,
  deleteData,
};
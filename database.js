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

async function fetchData(db, collectionName, query) {
  return db.collection(collectionName).find(query).toArray();
}

async function getData(collectionName, query) {
  const db = await connectDB();
  return await fetchData(db, collectionName, query);
}

async function insertDataToDB(db, collectionName, data) {
  return db.collection(collectionName).insertOne(data);
}

async function insertData(collectionName, data) {
  const db = await connectDB();
  return await insertDataToDB(db, collectionName, data);
}

async function updateDataInDB(db, collectionName, query, newData) {
  return db.collection(collectionName).updateOne(query, { $set: newData });
}

async function updateData(collectionName, query, newData) {
  const db = await connectDB();
  return await updateDataInDB(db, collectionName, query, newData);
}

async function deleteDataFromDB(db, collectionName, query) {
  return db.collection(collectionName).deleteOne(query);
}

async function deleteJIdata(collectionName, query) {
  const db = await connectDB();
  return await deleteDataFromDB(db, collectionName, query);
}

module.exports = {
  connectDB,
  disconnectDB,
  getData,
  insertData,
  updateData,
  deleteData: deleteJIdata,
};
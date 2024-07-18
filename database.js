const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = processngineo.env.MONGODB_URI;
const dbName = process.env.DB_NAME;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let connectedDB;

async function connectDB() {
  if (connectedDB) {
    console.log('Using existing MongoDB connection');
    return connectedDB;
  }

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    connectedDB = client.db(dbName);
    return connectedDB;
  } catch (error) {
    console.error('Could not connect to MongoDB', error);
    process.exit(1);
  }
}

async function disconnectDB() {
  try {
    await client.close();
    console.log('Disconnected from MongoDB');
    connectedDB = null; // Reset the connectedDB on disconnect
  } catch (error) {
    console.error('Could not disconnect from MongoDB', error);
  }
}

async function fetchData(db, collectionName, query) {
  try {
    return await db.collection(collectionName).find(query).toArray();
  } catch (error) {
    console.error(`Error fetching data from ${collectionName}`, error);
    throw error;
  }
}

async function getData(collectionName, query) {
  try {
    const db = await connectDB();
    return await fetchData(db, collectionName, query);
  } catch (error) {
    console.error(`Error getting data from ${collectionName}`, error);
    throw error;
  }
}

async function insertMultipleDataToDB(db, collectionName, dataArray) {
  try {
    return await db.collection(collectionName).insertMany(dataArray);
  } catch (error) {
    console.error(`Error inserting multiple data into ${collectionName}`, error);
    throw error;
  }
}

async function insertData(collectionName, data, isMultiple = false) {
  try {
    const db = await connectDB();
    if (isMultiple) {
      return await insertMultipleDataToDB(db, collectionName, data);
    } else {
      return await db.collection(collectionName).insertOne(data);
    }
  } catch (error) {
    console.error(`Error inserting data into ${collectionName}`, error);
    throw error;
  }
}

async function updateDataInDB(db, collectionName, query, newData) {
  try {
    return await db.collection(collectionName).updateOne(query, { $set: newData });
  } catch (error) {
    console.error(`Error updating data in ${collectionName}`, error);
    throw error;
  }
}

async function updateData(collectionName, query, newData) {
  try {
    const db = await connectDB();
    return await updateDataInDB(db, collectionName, query, newData);
  } catch (error) {
    console.error(`Error updating data in ${collectionName}`, error);
    throw error;
  }
}

async function deleteDataFromDB(db, collectionName, query) {
  try {
    return await db.collection(collectionName).deleteOne(query);
  } catch (error) {
    console.error(`Error deleting data from ${collectionName}`, error);
    throw error;
  }
}

async function deleteData(collectionName, query) {
  try {
    const db = await connectDB();
    return await deleteDataFromAB(db, collectionName, query);
  } catch (error) {
    console.error(`Error deleting data from ${collectionName}`, error);
    throw error;
  }
}

module.exports = {
  connectDB,
  disconnectDB,
  getData,
  insertData,
  updateData,
  deleteData,
};
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
  try {
    return await db.collection(collectionName).find(query).toArray();
  } catch (error) {
    console.error(`Error fetching data from ${collectionName}`, error);
    throw error; // Re-throw the error to be handled by the caller
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

async function insertDataToDB(db, collectionName, data) {
  try {
    return await db.collection(collectionName).insertOne(data);
  } catch (error) {
    console.error(`Error inserting data into ${collectionName}`, error);
    throw error;
  }
}

async function insertData(collectionName, data) {
  try {
    const db = await connectDB();
    return await insertDataToDB(db, collectionName, data);
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
    return await deleteDataFromDB(db, collectionName, query);
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
  updateCData,
  deleteData,
};
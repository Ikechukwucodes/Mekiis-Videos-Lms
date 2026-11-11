import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { env } from './env.js';

let mongodInstance = null;
let persistentLocal = false;

const startEmbeddedMongo = async ({ persist }) => {
  const { MongoMemoryServer } = await import('mongodb-memory-server');

  if (persist) {
    const dbPath = path.resolve(env.MONGO_DATA_DIR);
    fs.mkdirSync(dbPath, { recursive: true });
    mongodInstance = await MongoMemoryServer.create({
      instance: {
        dbName: 'lms_platform',
        dbPath,
        storageEngine: 'wiredTiger'
      }
    });
    persistentLocal = true;
    console.log(`✅ Persistent embedded MongoDB using ${dbPath}`);
  } else {
    mongodInstance = await MongoMemoryServer.create();
    persistentLocal = false;
    console.log('✅ Ephemeral in-memory MongoDB started');
  }

  return mongodInstance.getUri();
};

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    let mongoUri = env.MONGODB_URI;
    const isTest = env.NODE_ENV === 'test';

    if (isTest) {
      mongoUri = await startEmbeddedMongo({ persist: false });
    } else if (!mongoUri) {
      console.log('⚡ No MONGODB_URI provided. Starting local embedded MongoDB with disk persistence...');
      mongoUri = await startEmbeddedMongo({ persist: true });
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    if (env.NODE_ENV !== 'test' && env.NODE_ENV !== 'production' && !mongodInstance) {
      console.warn(`⚠️ External MongoDB failed (${error.message}). Falling back to persistent embedded MongoDB...`);
      const fallbackUri = await startEmbeddedMongo({ persist: true });
      const conn = await mongoose.connect(fallbackUri);
      console.log(`✅ Embedded MongoDB connected: ${conn.connection.host}`);
      return conn;
    }

    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongodInstance) {
      await mongodInstance.stop(!persistentLocal);
      mongodInstance = null;
    }
    console.log('🛑 MongoDB disconnected.');
  } catch (error) {
    console.error('❌ Error disconnecting MongoDB:', error.message);
  }
};

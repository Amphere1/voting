import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) throw new Error('MongoDB URI not defined');

let cached = global.mongoose || { conn: null, promise: null };

export async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

global.mongoose = cached;
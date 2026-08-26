import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import mongoose from "mongoose";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error("❌ MONGODB_URI não está definida nas variáveis de ambiente.");
    }

    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log("✅ Mongoose conectado com sucesso:", mongooseInstance.connection.db?.databaseName);
      return mongooseInstance;
    }).catch((error) => {
      console.error("❌ Falha na conexão Mongoose:", error.message);
      cached.promise = null;
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
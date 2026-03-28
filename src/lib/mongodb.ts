import mongoose, { type ConnectOptions } from "mongoose";

/**
 * Reuse a single Mongoose connection across hot reloads (dev) and within one
 * serverless isolate (Netlify Functions / Next.js route handlers). Without this,
 * each invocation can call `mongoose.connect` again and exhaust Atlas connection
 * limits ("Too many connections").
 */
const MONGODB_URI = process.env.MONGODB_URI;

const GLOBAL_CACHE_KEY = "__portfolio_mongoose_cache__" as const;

type MongooseConnectionCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

function getGlobalCache(): MongooseConnectionCache {
  const g = globalThis as typeof globalThis & {
    [GLOBAL_CACHE_KEY]?: MongooseConnectionCache;
  };
  if (!g[GLOBAL_CACHE_KEY]) {
    g[GLOBAL_CACHE_KEY] = { conn: null, promise: null };
  }
  return g[GLOBAL_CACHE_KEY];
}

const cached = getGlobalCache();

/** Tuned for short-lived serverless workers — small pool limits concurrent sockets per isolate. */
const connectOptions: ConnectOptions = {
  maxPoolSize: 10,
  minPoolSize: 0,
  serverSelectionTimeoutMS: 10_000,
};

/** 0 disconnected, 1 connected, 2 connecting, 3 disconnecting */
function connectionReadyState(): number {
  return mongoose.connection.readyState;
}

export async function connectDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  const readyState = connectionReadyState();

  if (readyState === 1) {
    cached.conn = mongoose;
    return mongoose;
  }

  if (readyState === 0 || readyState === 3) {
    cached.promise = null;
    cached.conn = null;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, connectOptions)
      .then(() => mongoose)
      .catch((err) => {
        cached.promise = null;
        cached.conn = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    cached.conn = null;
    throw err;
  }
}

const { MongoClient } = require("mongodb");
const dns = require("dns").promises;
require('dotenv').config();

// Use MONGO_URL from .env if present, otherwise the placeholder
const uri = process.env.MONGO_URL || "mongodb+srv://<username>:<password>@cluster0.b9qtcmr.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  family: 4, // force IPv4
});

async function run() {
  try {
    await client.connect();
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  } finally {
    await client.close();
  }
}

run();

(async () => {
  try {
    const records = await dns.resolveSrv("_mongodb._tcp.cluster0.b9qtcmr.mongodb.net");
  } catch (err) {
    console.error("DNS SRV error:", err);
  }
})();

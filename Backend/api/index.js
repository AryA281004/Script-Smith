const app = require('../src/app');
const connectDB = require('../src/db/db');
const { connectRedis } = require('../src/db/redis');

let initialized = false;

const initialize = async () => {
  if (initialized) return;
  initialized = true;

  await Promise.allSettled([
    connectDB(),
    connectRedis(),
  ]);
};

module.exports = async (req, res) => {
  await initialize();
  return app(req, res);
};

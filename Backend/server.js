const app = require('./src/app');
const connectDB = require('./src/db/db');
const { connectRedis } = require('./src/db/redis');



app.listen(3000, () => {
  console.log('✅ Server is running on port 3000');
  connectDB();
  connectRedis();
});


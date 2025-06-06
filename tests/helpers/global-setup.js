const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async () => {
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGODB_URI = uri;
  process.env.NODE_ENV = 'test';
  global.__MONGODB_SERVER__ = mongoServer;
};

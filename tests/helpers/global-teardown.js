module.exports = async () => {
  if (global.__MONGODB_SERVER__) {
    await global.__MONGODB_SERVER__.stop();
  }
};

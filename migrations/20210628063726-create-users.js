module.exports = {
  up: (queryInterface) => {
    const { migrate } = require('./migrateUtils');
    return migrate(__filename, queryInterface);
  },
  down: () => Promise.reject(new Error('error'))
};

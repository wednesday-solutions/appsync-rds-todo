// eslint-disable-next-line
import pg from 'pg';
import Sequelize, { DataTypes } from 'sequelize';
import _lists from './lists';
import _notes from './notes';
import _users from './users';

let db = null;
export function getDB() {
  if (db) {
    return db;
  }
  let sequelize;
  if (process.env.NODE_ENV === 'test') {
    const SequelizeMock = require('sequelize-mock');
    sequelize = new SequelizeMock();
  } else {
    const config = {
      uri: `${process.env.DB_DIALECT}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
      options: {
        host: process.env.DB_HOST,
        logging: console.log,
        dialect: process.env.DB_DIALECT,
        dialectOptions: {
          decimalNumbers: true,
          multipleStatements: true
        },
        pool: {
          min: 0,
          max: 30,
          idle: 60000,
          acquire: 60000,
          handleDisconnects: true,
          evict: 3000
        },
        define: {
          paranoid: true,
          underScored: true,
          timestamps: true
        }
      }
    };
    sequelize = new Sequelize(config.uri, config.options);
  }
  console.log('connected to database', sequelize);
  const lists = _lists(sequelize, DataTypes);
  const notes = _notes(sequelize, DataTypes);
  const users = _users(sequelize, DataTypes);

  notes.belongsTo(lists, { foreignKey: 'listId' });
  lists.hasMany(notes, { foreignKey: 'listId' });
  lists.belongsTo(users, { foreignKey: 'userId' });
  users.hasMany(lists, { foreignKey: 'userId' });

  db = {
    lists,
    notes,
    users
  };
  return db;
}
getDB();
export default db;

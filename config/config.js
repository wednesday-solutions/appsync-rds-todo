module.exports = {
  local: {
    url: `${process.env.DB_DIALECT}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    logging: true,
    dialect: 'postgres',
    options: {
      dialect: 'postgres',
      pool: {
        min: 0,
        max: 10,
        idle: 10000
      },
      define: {
        userscored: true,
        timestamps: false
      }
    }
  },
  development: {
    url: `${process.env.DB_DIALECT}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    logging: true,
    dialect: 'postgres',
    options: {
      dialect: 'postgres',
      pool: {
        min: 0,
        max: 10,
        idle: 10000
      },
      define: {
        userscored: true,
        timestamps: false
      }
    }
  },
  production: {
    url: `${process.env.DB_DIALECT}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    logging: true,
    dialect: 'postgres',
    options: {
      dialect: 'postgres',
      pool: {
        min: 0,
        max: 10,
        idle: 10000
      },
      define: {
        userscored: true,
        timestamps: false
      }
    }
  },
  qa: {
    url: `${process.env.DB_DIALECT}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    logging: true,
    dialect: 'postgres',
    options: {
      dialect: 'postgres',
      pool: {
        min: 0,
        max: 10,
        idle: 10000
      },
      define: {
        userscored: true,
        timestamps: false
      }
    }
  }
};

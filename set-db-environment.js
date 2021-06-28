async function setDbEnvironment(serverless) {
  const DB_HOST = await require('./get-host')(serverless);
  return {
    ...process.env,
    DB_DIALECT: 'postgres',
    DB_NAME: `${process.env.RDS_PREFIX}_${process.env.STAGE}`,
    DB_HOST,
    DB_USERNAME: `${process.env.RDS_USERNAME}_${process.env.STAGE}`,
    DB_PASSWORD: `${process.env.DB_PASSWORD}`,
    DB_PORT: `${process.env.DB_PORT}`
  };
}
module.exports.env = setDbEnvironment;

import 'source-map-support/register';
/**
 *
 * DatabaseMigrate
 *
 */
import shell from 'shelljs';

exports.handler = async (event, context, callback) => {
  console.log(JSON.stringify(event));
  shell.exec(`npx sls migrations up --stage=${process.env.STAGE} --dbHost=${process.env.DB_HOST}`);
};

import 'source-map-support/register';
/**
 *
 * DatabaseMigrate
 *
 */
import shell from 'shelljs';

exports.handler = async (event, context, callback) => {
  console.log(JSON.stringify(event));
  shell.exec(`node_modules/sequelize-cli/lib/sequelize db:migrate --config config/config.js`);
};

async function migrate(serverless) {
  try {
    const getHost = require('./get-host');
    const host = await getHost(serverless);
    if (host) {
      return `npx sls migrations up --stage=${serverless.variables.options.stage} --dbHost=${host}`;
    }
  } catch (e) {
    serverless.cli.log('Migration failed.');
    serverless.cli.log(e);
  }
  return '';
}
async function postDeployment(serverless) {
  return await migrate(serverless);
}
module.exports = postDeployment;

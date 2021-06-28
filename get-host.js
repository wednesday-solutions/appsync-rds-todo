async function getHost(serverless) {
  const get = require('lodash/get');
  try {
    if (
      !(
        (process.env.IS_LOCAL && JSON.parse(process.env.IS_LOCAL)) ||
        (process.env.IS_OFFLINE && JSON.parse(process.env.IS_OFFLINE)) ||
        get(serverless, 'processedInput.commands', []).includes('offline') ||
        Object.keys(get(serverless, 'processedInput.options', {})).includes('offline')
      )
    ) {
      const res = await serverless.getProvider('aws').request('CloudFormation', 'describeStacks', {
        StackName: `${process.env.NAME}-${serverless.variables.options.stage}`
      });

      const outputs = res.Stacks[0].Outputs;
      for (let i = 0; i < outputs.length; i++) {
        if (outputs[i].OutputKey === 'RDSHost') {
          return outputs[i].OutputValue;
        }
      }
    } else {
      return 'localhost';
    }
  } catch (e) {
    console.log(e);
    console.log('failed to get host');
  }

  return '';
}
module.exports = getHost;

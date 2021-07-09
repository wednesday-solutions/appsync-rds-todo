module.exports = function (serverless) {
  if (serverless.variables.options.offline) {
    return 'localhost';
  }
  return { 'Fn::GetAtt': ['RDSCluster', 'Endpoint.Address'] };
};

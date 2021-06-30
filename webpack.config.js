const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const nodeExternals = require('webpack-node-externals');
// eslint-disable-next-line import/no-extraneous-dependencies
const slsw = require('serverless-webpack');

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  mode: 'production',
  externals: [nodeExternals()],
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [['env', { targets: { node: '6.10' } }]]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CopyPlugin([
      { from: './migrations/**/*.*', to: '' },
      { from: './config/config.js', to: 'config/config.js' }
    ])
  ],
  resolve: {
    modules: ['node_modules', './'],
    alias: {
      '@models': path.resolve(__dirname, 'models/'),
      '@utils': path.resolve(__dirname, 'utils/'),
      '@daos': path.resolve(__dirname, 'daos/'),
      '@services': path.resolve(__dirname, 'services/')
    },
    extensions: ['.js', '.jsx', '.react.js'],
    mainFields: ['browser', 'jsnext:main', 'main']
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js'
  }
};

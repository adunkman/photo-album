const NodemonPlugin = require('nodemon-webpack-plugin');
const { NODE_ENV } = process.env;

module.exports = {
  mode: NODE_ENV === 'production' ? 'production' : 'development',
  watch: NODE_ENV !== 'production',
  entry: NODE_ENV === 'production'
    ? { lambda: './lambda.js' }
    : { local: './local.js' },
  target: 'node',
  output: {
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [ '@babel/preset-env', { "targets": { "node": "current" } }, ]
            ]
          }
        }
      },
      {
        test: /\.(png|woff2)$/i,
        use: {
          loader: 'url-loader',
        },
      }
    ]
  },
  plugins: [
    new NodemonPlugin()
  ]
};

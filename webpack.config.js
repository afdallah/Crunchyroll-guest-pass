const path = require('path')
require('@babel/polyfill')

module.exports = {
  entry: ['@babel/polyfill', './scripts/main.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        use: 'babel-loader'
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname),
    compress: true,
  }
};
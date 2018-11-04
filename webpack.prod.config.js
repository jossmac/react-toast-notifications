const webpack = require('webpack');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    path: __dirname + "/dist",
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'ReactToastNotifications'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
  externals: [ 'react', 'react-dom' ],
  plugins: []
};

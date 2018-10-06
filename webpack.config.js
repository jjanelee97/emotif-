const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
// const DashboardPlugin = require('webpack-dashboard/plugin');

const extractLess = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
  disable: process.env.NODE_ENV === 'development',
});

const extractSass = new ExtractTextPlugin({
  filename: 'style.css',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = {
  entry: ['./src'],
  devtool: 'inline-source-map',
  output: {
    path: path.join(__dirname, 'public/build'),
    publicPath: '/build/',
    filename: 'bundle.js',
  },
  devServer: {
    quiet: true,
    contentBase: path.join(__dirname, 'public'),
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /(\.scss)$/,
        use: extractSass.extract({
          use: [
            {
              loader: 'css-loader',
              options: { sourceMap: true },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [autoprefixer()],
              },
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: true },
            },
          ],
          fallback: 'style-loader', // use style-loader in development mode
        }),
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader'],
      },
    ],
  },
  plugins: [
    extractSass,
    extractLess,
    new FriendlyErrorsWebpackPlugin(),
  ],
};

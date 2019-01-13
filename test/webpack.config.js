const path = require('path');
const {CheckerPlugin} = require('awesome-typescript-loader');
//const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const chalk = require('chalk');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');


module.exports = {
  entry: './test/app/index.ts',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../test_dist')
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.html', '.css']
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: ['awesome-typescript-loader?configFileName="./tsconfig.json"', 'angular2-template-loader'],
        exclude:  [/__tests__/]
      },
      {
        test: /\.(html|css)$/,
        use: 'raw-loader',
        exclude: [/__tests__/]
      }
    ]
  },
  plugins: [
    new CheckerPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: './test/index.html'
    }),
    new ProgressBarPlugin({
      format: '  build [' + chalk.blue.bold(':bar') + ']' + chalk.green.bold(':percent') + ' (:elapsed seconds) => :msg...  ',
      clear: false
    }),
    // new OpenBrowserPlugin({
    //   url: `http://localhost:8888`
    // })

  ],
  devServer: {
    // https: true,
    //hot: true,
    stats: 'errors-only',
    port: 8888,
    inline: true,
    historyApiFallback: {
      index: './test/'
    },
    open: false
  }
};
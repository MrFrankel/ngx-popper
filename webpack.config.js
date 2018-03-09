const path = require('path');
const {CheckerPlugin} = require('awesome-typescript-loader');
const webpack = require('webpack');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const chalk = require('chalk');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;

module.exports = {
  entry: './example/app/index.ts',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.html', '.css']
  },
  devtool: 'source-map',
  module: {
    rules: [
        {
          test: /\.ts?$/,
          use: ['awesome-typescript-loader', 'angular2-template-loader']
        },
    //  { test: /\.ts$/, loaders: ['@ngtools/webpack'] },
      /* Embed files. */
      {
        test: /\.(html|css)$/,
        loader: 'raw-loader'
      }
    ]
  },
  plugins: [
    new CheckerPlugin(),
    new AngularCompilerPlugin({
      tsConfigPath: './tsconfig.json',
      entryModule: 'example/app/app.module#AppModule',
      sourceMap: true
    }),

    new HtmlWebpackPlugin({
      inject: true,
      template: 'example/index.html'
    }),
    new ProgressBarPlugin({
      format: '  build [' + chalk.blue.bold(':bar') + ']' + chalk.green.bold(':percent') + ' (:elapsed seconds) => :msg...  ',
      clear: false
    }),
    new OpenBrowserPlugin({
      url: `http://localhost:8888`
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    // https: true,
    hot: true,
    stats: 'errors-only',
    port: 8888,
    inline: true,
    historyApiFallback: {
      index: './example/'
    },
    open: false
  }
};
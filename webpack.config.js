const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const config = {
  // mode: "production", // "production" | "development" | "none"
  // Chosen mode tells webpack to use its built-in optimizations accordingly.
  entry: {
    //app: './dist/bin/www.js',  // string | object | array
  }, 
  output: {
    path: path.resolve(__dirname, "build"), // string
    // the target directory for all output files
    // must be an absolute path (use the Node.js path module)
    filename: '[name].js',
    clean: true,
    
  },
  target: 'node', // in order to ignore built-in modules like path, fs, etc. 
  externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.ts(x)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  optimization:{
    minimize: true,
    minimizer:[
      new CssMinimizerPlugin(),
    ],
    
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "./tsc-output/", to: "./" },
        { from: "./public", to: "./public" },
        { from: "./views", to: "./views" },
        { from: "./src/models/schema", to: "./models/schema" },
        { from: "./src/bin/cert.csr", to: "./bin/" },
        { from: "./src/bin/certificate.pem", to: "./bin/" },
        { from: "./src/bin/private.key", to: "./bin/" },
      ]
    }),
    new HtmlWebpackPlugin({
      templateContent: ({ htmlWebpackPlugin }) => '<!DOCTYPE html><html><head><meta charset=\"utf-8\"><title>' + htmlWebpackPlugin.options.title + '</title></head><body><div id=\"app\"></div></body></html>',
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin()
  ],
  resolve: {
    extensions: [
      '.tsx',
      '.ts',
      '.js'
    ]
  }
};

module.exports = config;

// webpack plugins to install
// npm install --save-dev webpack webpack-cli dotenv babel-loader @babel/core @babel/preset-env css-loader style-loader copy-webpack-plugin css-minimizer-webpack-plugin html-webpack-plugin typescript ts-loader mini-css-extract-plugin clean-webpack-plugin css-loader sass-loader node-sass style-loader

/*
module.exports = {
  mode: "production", // "production" | "development" | "none"
  // Chosen mode tells webpack to use its built-in optimizations accordingly.
  entry: {
    app: './dist/bin/www.js',  // string | object | array
  }, 
  output: {
    path: path.resolve(__dirname, "dist"), // string
    // the target directory for all output files
    // must be an absolute path (use the Node.js path module)
    filename: '[name].js',
    clean: true,
    
  },
  target: 'node', // in order to ignore built-in modules like path, fs, etc. 
  module: {
    rules: [
        {
          exclude: path.resolve(__dirname, "node_modules"),
        },
    ]
},
resolve: {
  extensions: ["", '.ts', '.tsx', '.js', '.json'],
},
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "./views", to: "dist/" },
        { from: "./src/bin/cert.csr", to: "../dist/bin/" },
        { from: "./src/bin/certificate.pem", to: "../dist/bin/" },
        { from: "./src/bin/private.key", to: "../dist/bin/" },
      ],
    }),
  ],
};

*/
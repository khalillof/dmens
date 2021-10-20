const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');
//const HtmlWebpackPlugin = require('html-webpack-plugin');

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
        }
    ]
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

//module.exports = {
//  entry: './index.ts',
//  output: {
//    filename: './[name].js'
//  },
//  resolve: {
//    extensions: ['.ts', '.tsx', '.js']
//  },
//  module: {
//    rules: [
//      { test: /.tsx?$/, loader: 'ts-loader' }
//    ]
//  }
//}
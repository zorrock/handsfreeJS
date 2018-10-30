// Modules
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const packageJSON = require('../package.json')

// Directories
const dirNode = 'node_modules'
const dirSandbox = path.join(__dirname, 'sandbox')
const dirAssets = path.join(__dirname, 'assets')
const dirSrc = path.join(__dirname, 'src')

// Settings
const IS_DEV = (process.env.NODE_ENV === 'dev')

/**
 * Webpack Configuration
 */
module.exports = {
  node: {fs: 'empty'},
  // Entry scripts
  entry: {
    handsfree: ['idempotent-babel-polyfill', path.join(__dirname, '../src/handsfree.js')],
    sandbox: path.join(__dirname, '../sandbox/index.js')
  },

  // Path resolvers
  resolve: {
    modules: [
      dirNode,
      dirSrc,
      dirSandbox,
      dirAssets
    ]
  },

  plugins: [
    new webpack.DefinePlugin({IS_DEV}),

    new HtmlWebpackPlugin({
      template: 'pug-loader!sandbox/index.pug',
      title: packageJSON.name
    }),

    new CopyWebpackPlugin([
      {from: 'assets', to: 'assets'}
    ])
  ],

  module: {
    rules: [
      /**
       * control-panel fix
       * @SEE https://github.com/freeman-lab/control-panel/issues/21
       */
      {
        test: /node_modules/,
        loader: 'ify-loader'
      },

      /**
       * Babel
       */
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
        options: {compact: 'auto'}
      },

      /**
       * Vanilla CSS
       */
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {sourceMap: IS_DEV}
          }
        ]
      },

      /**
       * CSS Preprocessors
       */
      {
        test: /\.styl/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {sourceMap: IS_DEV}
          },
          {
            loader: 'stylus-loader',
            options: {
              sourceMap: IS_DEV,
              includePaths: [dirAssets]
            }
          }
        ]
      },

      /**
       * Images
       */
      {
        test: /\.(jpe?g|png|gif)$/,
        loader: 'file-loader',
        options: {name: '[path][name].[ext]'}
      },

      /**
       * WASM
       */
       {
         test: /\.wasm$/,
         type: 'javascript/auto',
         loaders: ['arraybuffer-loader']
       }
    ]
  }
}

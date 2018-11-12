const path = require('path')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

const NODE_ENV = process.env.NODE_ENV || 'development'
const isProd = NODE_ENV === 'production'

module.exports = {
  mode: NODE_ENV,
  devtool: isProd
    ? false
    : '#cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, '../dist'), 
    publicPath: '/dist/', 
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    alias: {
      'public': path.resolve(__dirname, '../public'),
      'src': path.resolve(__dirname, '../src'),
      'components': path.resolve(__dirname, '../src/components'),
      'api': path.resolve(__dirname, '../api'),
      'configuration': path.resolve(__dirname, '../configuration'),
      'model': path.resolve(__dirname, '../model')
    }
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.css$/,
        oneOf: [
          {
            use: [
              'vue-style-loader',
              {
                loader: 'css-loader',
                options: { minimize: isProd }
              },
              'postcss-loader'
            ]
          }
        ]
      },
      {
        test: /\.styl(us)?$/,
        oneOf: [
          {
            use: [
              'vue-style-loader',
              {
                loader: 'css-loader',
                options: { minimize: isProd }
              },
              'postcss-loader',
              'stylus-loader'
            ]
          }
        ]
      },
    ]
  },
  optimization: {
    minimizer: isProd ? [
      // we specify a custom UglifyJsPlugin here to get source maps in production
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: true,
          ecma: 6,
          mangle: true
        },
        sourceMap: true
      })
    ]: undefined
  },
  performance: {
    maxEntrypointSize: 300000,
    hints: isProd ? 'warning' : false
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'common.[chunkhash].css'
    }),
    ... isProd ? [] : [ new FriendlyErrorsPlugin() ]
  ],
}

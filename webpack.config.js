const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const path = require('path');
const { env } = require('process');

function getPlugins() {
  if (env.NODE_ENV === 'production') {
    return [
      new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        sourceMap: true,

        compress: {
          warnings: false
        },

        output: {
          comments: false
        }
      }),

      new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|css|html|json|ico|svg|eot|otf|ttf)$/
      })
    ];
  }

  return [];
}

function getExternals() {
  if (env.NODE_ENV === 'production') {
    return {
      "react": "React"
    };
  }

  return {};
}

module.exports = {
  devtool: (env.NODE_ENV === 'development' ? 'cheap-module-eval-source-map' : false),

  entry: {
    index: 'index',
    'dev-server-bundle': './dev-server-bundle',
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },

  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },

  externals: getExternals(),

  // Instruct webpack how to handle each file type that it might encounter
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'dev-server-bundle')],
        loader: 'babel-loader',
      },
      {
        test: /\.css$/i,
        include: [path.resolve(__dirname, 'src')],
        use: [
          'style-loader',
          'css-loader',
        ]
      }
    ]
  },

  plugins: getPlugins(),

  devServer: {
    contentBase: path.join(__dirname, "public"),
  }
};
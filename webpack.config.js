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
          warnings: false,
        },

        output: {
          comments: false,
        },
      }),

      new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|css|html|json|ico|svg|eot|otf|ttf)$/,
      }),
    ];
  }

  return [];
}

function getExternals() {
  if (env.NODE_ENV === 'production') {
    return {
      react: 'React',
    };
  }

  return {};
}

module.exports = {
  devtool: env.NODE_ENV === 'development' ? 'eval-cheap-module-source-map' : false,

  mode: env.NODE_ENV === 'development' ? 'development' : 'production',

  entry: {
    index: 'index',
    RESTClient: 'RESTClient',
    'dev-server-bundle': './dev-server-bundle',
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    alias: {
      'react/jsx-dev-runtime': 'react/jsx-dev-runtime.js',
      'react/jsx-runtime': 'react/jsx-runtime.js',
    },
  },

  externals: getExternals(),

  // Instruct webpack how to handle each file type that it might encounter
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/i,
        include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'dev-server-bundle')],
        loader: 'babel-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  plugins: getPlugins(),

  devServer: {
    allowedHosts: ['interconr.intercode.test'],
    static: path.join(__dirname, 'public'),
    proxy: {
      '/cms_navigation_items': { target: 'http://interconr.intercode.test:5000' },
      '/pages': { target: 'http://interconr.intercode.test:5000' },
    },
  },
};

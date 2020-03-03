import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import WebExtWebpackPlugin from './utils/webpack/web-ext-webpack-plugin';
import TerserJSPlugin from 'terser-webpack-plugin';
import OptimizeCssAssetsWebpackPlugin from 'optimize-css-assets-webpack-plugin';

const webpackConfiguration = (_, argv) => {
  const isProduction = argv.mode;

  const configuration = {
    entry: {
      background_scripts: path.resolve('src', 'background_scripts', 'index.js'),
      popup: path.resolve('src', 'popup', 'index.js'),
    },
    output: {
      path: path.resolve('dist'),
      filename: path.join('[name]', 'index.js'),
    },
    // Configures Loaders
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /.(post)?css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            'css-loader',
            'postcss-loader',
          ],
        },
      ],
    },
    // Configures Plugins
    plugins: [
      new HtmlWebpackPlugin({
        filename: path.resolve('dist', 'popup', 'index.html'),
        template: path.resolve('src', 'popup', 'index.html'),
        minify: isProduction
          ? {
              collapseWhitespace: true,
              removeComments: true,
              removeRedundantAttributes: true,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributes: true,
              useShortDoctype: true,
            }
          : false,
        hash: isProduction,
      }),
      new MiniCssExtractPlugin({
        filename: path.join('[name]', 'style.css'),
      }),
      new CopyWebpackPlugin([
        {
          from: path.join('src', 'manifest.json'),
        },
        {
          from: path.join('src', 'icons', '*.png'),
          to: 'icons',
          flatten: true,
        },
      ]),
    ],
    optimization: isProduction
      ? {
          minimizer: [
            new TerserJSPlugin({}),
            new OptimizeCssAssetsWebpackPlugin({}),
          ],
        }
      : {},
  };

  if (!isProduction) {
    configuration.plugins.push(new WebExtWebpackPlugin());
  }

  return configuration;
};

export default webpackConfiguration;

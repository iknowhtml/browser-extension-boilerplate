import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import WebExtWebpackPlugin from './utils/webpack/web-ext-webpack-plugin';

const webpackConfiguration = () => ({
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
    ],
  },
  // Configures Plugins
  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'src/**/*',
        ignore: ['*.js'],
        transformPath(targetPath, absolutePath) {
          console.log(targetPath);
          console.log(absolutePath);
          return targetPath.replace(/src(\/|\\)/, '');
        },
      },
    ]),
    new WebExtWebpackPlugin({ target: 'chromium' }),
  ],
  devtool: 'cheap-module-source-map',
});

export default webpackConfiguration;

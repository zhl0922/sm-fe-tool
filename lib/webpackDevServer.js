"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = webpackDevServer;

var _webpack = _interopRequireDefault(require("webpack"));

var _webpackDevServer = _interopRequireDefault(require("webpack-dev-server"));

var _createWebpackConfig = _interopRequireDefault(require("./createWebpackConfig"));

var _user = require("./user");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function devServer(webpackConfig, serverConfig) {
  const {
    host,
    port
  } = serverConfig;
  const webpackDevServerOptions = {
    clientLogLevel: 'warning',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    hot: true,
    // hotOnly: true,
    overlay: {
      warnings: false,
      errors: true
    },
    publicPath: webpackConfig.output.publicPath,
    quiet: true,
    inline: true,
    compress: true,
    watchOptions: {
      poll: false
    }
  };
  const compiler = (0, _webpack.default)(webpackConfig);
  const server = new _webpackDevServer.default(compiler, webpackDevServerOptions);
  server.listen(port, host, err => {
    if (err) {
      (0, _utils.error)('server start failed' + err);
      process.exit(1);
    }
  });
}

function webpackDevServer(args, serverConfig, buildConfig) {
  process.env.NODE_ENV = 'development';
  const userConfig = (0, _user.getUserConfig)(args);

  if ((0, _utils.typeOf)(buildConfig) === 'function') {
    buildConfig = buildConfig(userConfig);
  }

  const webpackConfig = (0, _createWebpackConfig.default)(userConfig, buildConfig);

  if (userConfig.webpack.publicPath) {
    webpackConfig.output.publicPath = userConfig.webpack.publicPath;
  } // console.log(JSON.stringify(webpackConfig, null, 4))


  devServer(webpackConfig, serverConfig);
}

module.exports = exports["default"];
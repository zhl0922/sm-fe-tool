"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.build = build;
exports.run = run;
exports.runExample = runExample;
exports.buildWebModule = buildWebModule;

var _chalk = _interopRequireDefault(require("chalk"));

var _webpackMerge = _interopRequireDefault(require("webpack-merge"));

var _webpack = _interopRequireDefault(require("webpack"));

var _path = _interopRequireDefault(require("path"));

var _htmlWebpackPlugin = _interopRequireDefault(require("html-webpack-plugin"));

var _friendlyErrorsWebpackPlugin = _interopRequireDefault(require("friendly-errors-webpack-plugin"));

var _webpackBuild = _interopRequireDefault(require("./webpackBuild"));

var _webpackDevServer = _interopRequireDefault(require("./webpackDevServer"));

var _constant = require("./constant");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getHMRClientEntries(host, port) {
  const hmrURL = `http://${host}:${port}/`;
  return [`${(0, _utils.resolve)('webpack-dev-server/client/')}?${hmrURL}`, (0, _utils.resolve)('webpack/hot/dev-server')];
}

function createBuildConfig() {
  return {
    splitChunks: true,
    progress: true,
    resourceMap: true,
    output: {
      filename: 'js/[name].[chunkhash].js',
      chunkFilename: 'js/[name].[chunkhash].js'
    },
    optimization: {
      concatenateModules: true
    }
  };
}

function build(args, commandConfig = {}) {
  let config = createBuildConfig();
  return (0, _webpackBuild.default)(args, (0, _webpackMerge.default)(config, commandConfig));
}

function run(args, commandConfig = {}) {
  const host = _constant.DEFAULT_DEV_SERVER_HOST;
  let {
    port = _constant.DEFAULT_DEV_SERVER_PORT
  } = args;
  const serverConfig = {
    host,
    port
  };
  let config = createServerConfig(serverConfig);
  return (0, _webpackDevServer.default)(args, serverConfig, (0, _webpackMerge.default)(config, commandConfig));
}

function runExample(args, commandConfig = {}) {
  const host = _constant.DEFAULT_DEV_SERVER_HOST;
  let {
    port = _constant.DEFAULT_DEV_SERVER_PORT
  } = args;
  const serverConfig = {
    host,
    port
  };
  const cwd = process.cwd();
  let config = createServerConfig(serverConfig);
  config = (0, _webpackMerge.default)(config, {
    resourceMap: false,
    plugins: [new _htmlWebpackPlugin.default({
      title: 'react component example',
      template: _path.default.join(__dirname, '../templates/webpack_template.html'),
      filename: 'index.html'
    })]
  });
  return (0, _webpackDevServer.default)(args, serverConfig, userConfig => {
    userConfig.webpack.entry = {
      app: _path.default.join(cwd, 'example/index.js')
    };
    delete userConfig.webpack.libraryTarget;
    delete userConfig.webpack.library;
    return (0, _webpackMerge.default)(config, commandConfig);
  });
}

function buildWebModule(args, commandConfig = {}) {
  return (0, _webpackBuild.default)(args, userConfig => {
    const cwd = process.cwd();
    userConfig.webpack.entry = {
      index: _path.default.join(cwd, 'src/index.js')
    };

    if (!userConfig.webpack.libraryTarget) {
      userConfig.webpack.libraryTarget = 'commonjs2';
    }

    let config = {
      isModule: true,
      progress: true,
      output: {
        filename: 'index.js',
        publicPath: './'
      },
      optimization: {
        concatenateModules: true
      }
    };
    return (0, _webpackMerge.default)(config, commandConfig);
  });
}

function createServerConfig(serverConfig) {
  const {
    host,
    port
  } = serverConfig;
  let publicPath = `http://${host}:${port}/`;
  return {
    progress: true,
    resourceMap: true,
    entry: getHMRClientEntries(host, port),
    output: {
      publicPath
    },
    devtool: '#cheap-module-source-map',
    plugins: [new _webpack.default.HotModuleReplacementPlugin(), new _friendlyErrorsWebpackPlugin.default({
      compilationSuccessInfo: {
        messages: [`app is running at ${publicPath}`]
      }
    })],
    optimization: {
      noEmitOnErrors: true
    }
  };
}
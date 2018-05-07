"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = webpackBuild;

var _webpack = _interopRequireDefault(require("webpack"));

var _rimraf = _interopRequireDefault(require("rimraf"));

var _path = _interopRequireDefault(require("path"));

var _chalk = _interopRequireDefault(require("chalk"));

var _createWebpackConfig = _interopRequireDefault(require("./createWebpackConfig"));

var _user = require("./user");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import ora from 'ora';
function webpackBuild(args, buildConfig) {
  process.env.NODE_ENV = 'production';
  const userConfig = (0, _user.getUserConfig)(args);

  if ((0, _utils.typeOf)(buildConfig) === 'function') {
    buildConfig = buildConfig(userConfig);
  }

  const webpackConfig = (0, _createWebpackConfig.default)(userConfig, buildConfig); // console.log(webpackConfig)

  let compiler = (0, _webpack.default)(webpackConfig);
  return new Promise((resolve, reject) => {
    (0, _rimraf.default)(webpackConfig.output.path, err => {
      if (err) throw err;
      compiler.run((err, stats) => {
        if (err) {
          (0, _utils.error)(err.stack || err);

          if (err.details) {
            (0, _utils.error)(err.details);
          }

          process.exit(1);
        }

        const statsOps = {
          colors: true,
          modules: false,
          children: false,
          chunks: false,
          chunkModules: false
        };
        const json = stats.toJson(statsOps);
        const string = stats.toString(statsOps);

        if (stats.hasErrors()) {
          (0, _utils.error)(json.errors);
          (0, _utils.error)('  Build failed with errors.\n');
          process.exit(1);
        }

        process.stdout.write(string + '\n\n');
      });
    });
  });
}

module.exports = exports["default"];
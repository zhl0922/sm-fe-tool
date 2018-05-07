"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createResourceMap;

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _path = _interopRequireDefault(require("path"));

var _constant = require("./constant");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createResourceMap(outputPath) {
  return function () {
    this.hooks.done.tap('ResourceMap', function (map) {
      map = map.toJson();
      const resourceMap = {
        js: [],
        css: []
      };
      Object.keys(map.entrypoints).forEach(entryName => {
        // console.log(map.assetsByChunkName)
        assetsToMap(map.assetsByChunkName[_constant.RUNTIME_CHUNK_NAME]);
        assetsToMap(map.assetsByChunkName[_constant.COMMON_CHUNK_NAME]);
        assetsToMap(map.assetsByChunkName[entryName]);

        function assetsToMap(assets) {
          if (!assets) return;

          if (Array.isArray(assets)) {
            assets.forEach(handle);
          } else {
            handle(assets);
          }

          function handle(assetsPath) {
            switch (_path.default.extname(assetsPath)) {
              case '.js':
                resourceMap.js.push(map.publicPath + assetsPath);
                break;

              case '.css':
                resourceMap.css.push(map.publicPath + assetsPath);
                break;
            }
          }
        }
      });

      const outputFile = _path.default.join(outputPath, 'resource.map.json');

      const json = JSON.stringify(resourceMap, null, 2);

      _fsExtra.default.outputFile(outputFile, json);
    });
  };
}

module.exports = exports["default"];
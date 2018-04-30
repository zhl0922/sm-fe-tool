import fse from 'fs-extra';
import path from 'path';
import { COMMON_CHUNK_NAME, RUNTIME_CHUNK_NAME } from './constant';
export default function createResourceMap(outputPath) {
    return function() {
        this.hooks.done.tap('ResourceMap', function (map) {
            map = map.toJson();
            const resourceMap = {
                js: [],
                css: []
            };
            Object.keys(map.entrypoints).forEach(entryName => {
                // console.log(map.assetsByChunkName)
                assetsToMap(map.assetsByChunkName[RUNTIME_CHUNK_NAME]);
                assetsToMap(map.assetsByChunkName[COMMON_CHUNK_NAME]);
                assetsToMap(map.assetsByChunkName[entryName]);

                function assetsToMap(assets) {
                    if (!assets) return;
                    if (Array.isArray(assets)) {
                        assets.forEach(handle)
                    } else {
                        handle(assets);
                    }
                    function handle(assetsPath) {
                        switch (path.extname(assetsPath)) {
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
            const outputFile = path.join(outputPath, 'resource.map.json');
            const json = JSON.stringify(resourceMap, null, 2);
            fse.outputFile(outputFile, json);
        });
    }
}
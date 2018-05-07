# sm-fe-tool

## 安装

全局安装

```sh
npm install -g git+http://192.168.80.129/common/platform/sm-fe-tool.git
```
在项目中安装，并在项目package.json script 中添加

```sh
npm install --save-dev git+http://192.168.80.129/common/platform/sm-fe-tool.git
```
```json
{
  "scripts": {
    "dev": "sm dev-server",
    "build": "sm build",
    "start": "sm node-server",
    "build-zip": "sm build-zip"
  }
}
```

## 命令
使用sm --help 查看详细使用说明

sm create <project_type> <project_name>
    Create a project in a new directory

    Project types:
      react-app        a react app
      react-component  a react component
      node-module      a node library npm module

sm dev-server [options]
    Start dev static dev server

    Options:
      --port  static dev server port and the default port is 4000

sm node-server [options]
    Start node server use nodemon, see nodemon documention

    Options:
      --debug  debug port and the default port is 5858

sm build
    Build project

sm build-zip
    Build zip for project in 'project/release/xxx.zip'

## 配置
在项目根目录新建sm.config.js

```js
module.exports = {
	config1: xxx,
	config2: xxx
}
或者
module.exports = function({webpack, args}) {
	return {
		config1: xxx,
		config2: xxx
	};
}
```
PS: sm.config.js 可以使用环境变量，如可以使用process.env.NODE_ENV添加配置
```js
{
    extractCss: process.env.NODE_ENV === 'production' ? true : false
}
```

#### type (String)
项目类型，现项目类型只有 [react-app, react-component]

#### [browsers](https://github.com/browserslist/browserslist) (Array|String)
browserslist 同时生效babel target 和 autoprefixer 默认为

```js
[
    "> 1%",
    "last 2 versions",
    "not ie <= 9"
]
```

#### nodeServer (Object)
nodejs nodemon 开发服务配置，提供本地监听重启

##### nodeServer.script (String)
入口文件 比如./www

##### nodeServer.watch (Array)
监听的文件或文件夹列表 如['server/']

更多配置查看[https://github.com/remy/nodemon](https://github.com/remy/nodemon)

#### zipGlob (Object)
zip打包配置，zipGlob须提供node-glob配置来筛选文件，详细配置查看[node-glob](https://github.com/isaacs/node-glob)

##### zipGlob.pattern (Array)
node-glob pattern

##### zipGlob.ignore (Array)
过滤的文件或文件夹列表 如['server/']

更多配置查看[https://github.com/isaacs/node-glob](https://github.com/isaacs/node-glob)

#### babel (Object)
babel相关配置，[babel](https://babeljs.io/)

##### babel.stage (Number/String)
babel stage 默认为2

##### babel.presets (Array)
附加预设

##### babel.plugins (Array)
附加插件

##### babel.config (Function)
更完全控制，比如

```js
module.exports = {
	babel: {
		config: function (config) {
			config.stage = 3;
			reutrn config;
		}
	}
}
```

#### webpack (Object)
webpack相关配置，[webpack](https://webpack.js.org/configuration/#options)

##### webpack.extractCss (Boolean)
是否提取css

##### [webpack.outputPath](https://webpack.js.org/configuration/output/#output-path) (String)
默认dist, projectType为react-component时，约定为 dist 配置无效

##### [webpack.entry](https://webpack.js.org/configuration/entry-context/#entry) (String|Array|Object)
projectType为react-component时，约定为 src/index.js 配置无效

##### [webpack.publicPath](https://webpack.js.org/configuration/output/#output-publicpath) (String)
开发环境默认 http:localhost:port，生成环境默认 /
projectType为react-component时，配置无效

##### [webpack.library](https://doc.webpack-china.org/configuration/output/#output-library) (Object|String)

##### [webpack.libraryTarget](https://doc.webpack-china.org/configuration/output/#output-librarytarget) (String)

##### [webpack.resolve](https://webpack.js.org/configuration/resolve/#resolve) (Object)

##### [webpack.copy](https://github.com/webpack-contrib/copy-webpack-plugin) (Object)

##### [webpack.externals](https://webpack.js.org/configuration/externals/) (Object)

##### [webpack.noParse](https://webpack.js.org/configuration/module/#module-noparse)

##### [webpack.define](https://doc.webpack-china.org/plugins/define-plugin/) (Object)

##### [webpack.gzip](https://github.com/webpack-contrib/compression-webpack-plugin) (Boolean|Object)
是否开启gzip，生长.gzip文件

##### [webpack.rules](https://webpack.js.org/configuration/module/#module-rules) (Array)
附加rules

##### [webpack.plugins](https://webpack.js.org/configuration/plugins/) (Array)
附加插件

##### webpack.config (Function)
更完全控制，比如

```js
module.exports = {
	webpack: {
		config: function (config) {
			config.outputPath = 'xxxx';
			reutrn config;
		}
	}
}
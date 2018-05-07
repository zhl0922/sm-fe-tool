/* module.exports = {
    type: 'react-app',
    broswers: [...],
    nodeServer: {
        script: './www',
        watch: [
            'server/',
            'st-proxy/'
        ],
        ...
    },
    zipGlob: {
        pattern: [],
        ignore: [],
        ...
    },
    babel: {
        stage: 2,
        presets: [...],
        plugins: [...],
        config: function (config) { return config }
    },
    webpack: {
        noParse: /moment/,
        extractCss: true,
        outputPath: 'client/dist',
        entry: './client/src/main.js',
        publicPath: process.env.NODE_ENV == 'production' ? 'http://' : '/',
        library: 'example',
        resolve: {
            alias: { '@': SRC_DIR },
        },
        copy: {
            from: '',
            to: ''
        },
        define: {
            NODE_ENV: ''
        },
        externals: {},
        plugins: [],
        rules: [],
        gzip: {},
        config: function (config) { return config }
    }
} */
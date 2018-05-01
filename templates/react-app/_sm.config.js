const path = require('path');
const SRC_DIR = path.resolve(__dirname, './client/src');
module.exports = {
    type: '{{projectType}}',
    nodeServer: {
        script: './www',
        watch: [
            'server/'
        ]
    },
    babel: {
        plugins: [
            path.resolve(__dirname, 'client/node_modules/react-hot-loader/babel')
        ]
    },
    webpack: {
        extractCss: true,
        outputPath: 'client/dist',
        entry: './client/src/main.js',
        resolve: {
            alias: {
                '@': SRC_DIR,
                '@assets': path.join(SRC_DIR, 'assets'),
                '@styles': path.join(SRC_DIR, 'styles'),
                '@components': path.join(SRC_DIR, 'components'),
                '@containers': path.join(SRC_DIR, 'containers'),
                '@models': path.join(SRC_DIR, 'models'),
                '@routes': path.join(SRC_DIR, 'routes'),
                '@utils': path.join(SRC_DIR, 'utils'),
                '@layouts': path.join(SRC_DIR, 'layouts'),
                '@model-core': path.join(SRC_DIR, 'model-core')
            },
            modules: [path.join(__dirname, "client")]
        }
    }
}
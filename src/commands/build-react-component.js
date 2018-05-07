import { buildWebModule } from '../commands';
import { resolve } from '../utils';
export default function buildReactComponent(args) {
    let config = {
        babel: {
            presets: [resolve('@babel/preset-react')]
        },
        externals: {
            react: {
                commonjs: 'react',
                commonjs2: 'react',
                amd: 'React',
                root: 'React'
            },
            'react-dom': {
                commonjs: 'react-dom',
                commonjs2: 'react-dom',
                amd: 'ReactDOM',
                root: 'ReactDOM'
            }
        },
    };
    return buildWebModule(args, config);
}
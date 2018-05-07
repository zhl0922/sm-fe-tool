import { resolve } from '../utils';
export default function() {
    return {
        babel: {
            runtime: true,
            dynamicImport: true,
            presets: [resolve('@babel/preset-react')],
            plugins: [resolve('babel-plugin-transform-react-remove-prop-types')]
        }
    };
}
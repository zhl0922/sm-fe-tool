import webpackDevServer from '../webpackDevServer';
import config from '../configs/react-app';
export default function runReactApp(args) {
    return webpackDevServer(args, config());
}
import webpackBuild from '../webpackBuild';
import config from '../configs/react-app';
export default function buildReactApp(args) {
    return webpackBuild(args, config());
}
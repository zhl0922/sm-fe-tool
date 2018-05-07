import { run } from '../commands';
import config from '../configs/react-app';
export default function runReactApp(args) {
    return run(args, config());
}
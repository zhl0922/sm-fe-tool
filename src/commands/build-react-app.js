import { build } from '../commands';
import config from '../configs/react-app';
export default function buildReactApp(args) {
    return build(args, config());
}
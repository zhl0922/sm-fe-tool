import { getProjectType } from '../user';
import { REACT_APP } from '../constant';
import buildReactApp from './build-react-app';

const commandsMap = {
    [REACT_APP]: buildReactApp
};

export default function build(args) {
    const projectType = getProjectType(args);
    commandsMap[projectType](args);
}
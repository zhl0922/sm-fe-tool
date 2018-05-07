import { getProjectType } from '../user';
import { REACT_APP, REACT_COMPONENT } from '../constant';
import buildReactApp from './build-react-app';
import buildReactComponent from './build-react-component';

const commandsMap = {
    [REACT_APP]: buildReactApp,
    [REACT_COMPONENT]: buildReactComponent
};

export default function build(args) {
    const projectType = getProjectType(args);
    if (!commandsMap[projectType]) {
        error(`[${projectType}] does not have this command`);
        process.exit(1);
    }
    commandsMap[projectType](args);
}
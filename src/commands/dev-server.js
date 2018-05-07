import { getProjectType } from '../user';
import { REACT_APP, REACT_COMPONENT } from '../constant';
import { error } from '../utils';
import runReactApp from './run-react-app';
import runReactComponent from './run-react-component';

const commandsMap = {
    [REACT_APP]: runReactApp,
    [REACT_COMPONENT]: runReactComponent
};

export default function devServer(args) {
    const projectType = getProjectType(args);
    if (!commandsMap[projectType]) {
        error(`[${projectType}] does not have this command`);
        process.exit(1);
    }
    commandsMap[projectType](args);
}
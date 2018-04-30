import { getProjectType } from '../user';
import { REACT_APP } from '../constant';
import runReactApp from './run-react-app';

const commandsMap = {
    [REACT_APP]: runReactApp
};

export default function devServer(args) {
    const projectType = getProjectType(args);
    commandsMap[projectType](args);
}
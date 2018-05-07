import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { runExample } from '../commands';
import path from 'path';
import reactConfig from '../configs/react-app';
export default function runReactComponentExample(args) {
    return runExample(args, reactConfig());
}
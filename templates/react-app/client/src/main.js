import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { routerReducer } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import App from '@routes';
import axios from '@utils/axios';
import asyncComponent from '@utils/asyncComponent';
import { createModel } from '@model-core';

const model = createModel({
    initialReducers: {
        router: routerReducer
    },
    history: createHistory()
});
model.init();

const MOUNT_NODE = document.getElementById('react-mount-node');
const render = () => {
    ReactDOM.render(
        <Provider store={model._store}>
            <App model={model} />
        </Provider>,
        MOUNT_NODE
    );
};
window.axios = axios;
window.asyncComponent = asyncComponent;
render();



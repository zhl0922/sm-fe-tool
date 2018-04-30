// from dva
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import { routerMiddleware } from 'react-router-redux';
import { combineReducers } from 'redux';

import prefixNamespace from './prefixNamespace';
import createStore from './createStore';
import getReducer from './getReducer';
import getSaga from './getSaga';
import createPromiseMiddleware from './promiseMiddleware';

import createLoading from './createLoading';
const globalLoading = createLoading();

const onEffect = [
    globalLoading.onEffect
];

export function createModel(opts = {}) {
    const {
        initialReducers = {},
        initialState = {},
        history
    } = opts;
    const core = {
        _models: [],
        _store: null,
        push,
        init,
        history
    };
    return core;

    function push(m) {
        if (core._models.some(model => model.namespace === m.namespace)) {
            console.warn(`${m.namespace} model 已存在`);
            return;
        }
        core._models.push(prefixNamespace(m));
    }

    function injectModel(createReducer, m) {
        push(m);
        const store = core._store;
        if (m.reducers) {
            store.asyncReducers[m.namespace] = getReducer(m.reducers, m.state);
            store.replaceReducer(createReducer());
        }
        if (m.effects) {
            store.runSaga(core._getSaga(m.effects, m, onEffect));
        }
    }

    function init() {
        const sagaMiddleware = createSagaMiddleware();
        const {
            middleware: promiseMiddleware,
            resolve,
            reject,
        } = createPromiseMiddleware(core);
        const middlewares = [
            routerMiddleware(history),
            sagaMiddleware,
            promiseMiddleware
        ];
        process.env.NODE_ENV === 'development' && (middlewares.push(logger));

        core._getSaga = getSaga.bind(null, resolve, reject);

        const sagas = [];
        const reducers = {
            ...initialReducers,
            ...globalLoading.reducers
        };
        for (const m of core._models) {
            reducers[m.namespace] = getReducer(m.reducers, m.state);
            if (m.effects) {
                sagas.push(core._getSaga(m.effects, m, onEffect));
            }
        }

        const store = core._store = createStore({
            reducers: createReducer(),
            initialState: initialState,
            middlewares
        });
        // 异步reducers
        store.asyncReducers = {};
        // 动态注入sagas
        store.runSaga = sagaMiddleware.run;
        sagas.forEach(sagaMiddleware.run);

        core.inject = injectModel.bind(core, createReducer);

        function createReducer() {
            return combineReducers({
                ...reducers,
                ...(core._store ? core._store.asyncReducers : {})
            });
        }
    }
}
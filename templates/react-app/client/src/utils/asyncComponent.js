import loadable from './loadable';
import React from 'react';
const modelCached = {};
function registerModel(modelCore, model) {
    model = model.default || model;
    if (!modelCached[model.namespace]) {
        modelCore.inject(model);
        modelCached[model.namespace] = 1;
    }
}
export default function asyncComponent(config) {
    // console.log(model)
    const {
        modelCore,
        component: resolveComponent,
        models: resolveModels
    } = config;
    const loader = () => {
        const models = typeof resolveModels === 'function' ? resolveModels() : [];
        const component = resolveComponent();
        return Promise.all([...models, component]).then(ret => {
            if (!models.length) {
                return ret[0];
            } else {
                const len = models.length;
                ret.slice(0, len).forEach((m) => {
                    registerModel(model, m);
                });
                return ret[len];
            }
        })
    }
    return loadable({
        loader: loader,
        loading: () => null
    });
}
// from dva
import * as sagaEffects from 'redux-saga/effects';
import {
    takeEveryHelper as takeEvery,
    takeLatestHelper as takeLatest,
    throttleHelper as throttle,
} from 'redux-saga/lib/internal/sagaHelpers';
import prefixType from './prefixType';

export default function getSaga(resolve, reject, effects, model, onEffect) {
    return function* () {
        for (const key in effects) {
            // console.log(key)
            if (Object.prototype.hasOwnProperty.call(effects, key)) {
                const watcher = getWatcher(resolve, reject, key, effects[key], model, onEffect);
                const task = yield sagaEffects.fork(watcher);
                yield sagaEffects.fork(function* () {
                    yield sagaEffects.take(`${model.namespace}/@@CANCEL_EFFECTS`);
                    yield sagaEffects.cancel(task);
                });
            }
        }
    };
}

function getWatcher(resolve, reject, key, _effect, model, onEffect) {
    let effect = _effect;
    let type = 'takeEvery';
    let ms;

    if (Array.isArray(_effect)) {
        effect = _effect[0];
        const opts = _effect[1];
        if (opts && opts.type) {
            type = opts.type;
            if (type === 'throttle') {
                ms = opts.ms;
            }
        }
    }

    function* sagaWithCatch(...args) {
        try {
            yield sagaEffects.put({ type: `${key}/@@start` });
            const ret = yield effect(...args.concat(createEffects(model)));
            yield sagaEffects.put({ type: `${key}/@@succeeded` });
            resolve(key, ret);
        } catch (e) {
            if (!e._dontReject) {
                reject(key, e);
                throw e;
            }
        }
    }

    const sagaWithOnEffect = applyOnEffect(onEffect, sagaWithCatch, model, key);
    switch (type) {
        case 'watcher':
            return sagaWithCatch;
        case 'takeLatest':
            return function* () {
                yield takeLatest(key, sagaWithOnEffect);
            };
        case 'throttle':
            return function* () {
                yield throttle(ms, key, sagaWithOnEffect);
            };
        default:
            return function* () {
                yield takeEvery(key, sagaWithOnEffect);
            };
    }
}

function createEffects(model) {
    function put(action) {
        const { type } = action;
        return sagaEffects.put({ ...action, type: prefixType(type, model) });
    }
    function take(type) {
        if (typeof type === 'string') {
            return sagaEffects.take(prefixType(type, model));
        } else {
            return sagaEffects.take(type);
        }
    }
    return { ...sagaEffects, put, take };
}

function applyOnEffect(fns, effect, model, key) {
    for (const fn of fns) {
        effect = fn(effect, sagaEffects, model, key);
    }
    return effect;
}
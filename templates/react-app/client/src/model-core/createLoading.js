// 全局loading  form dva and add error state
const SHOW = '@@loading/SHOW';
const HIDE = '@@loading/HIDE';

function createLoading() {
    const namespace = 'loading';
    const initialState = {
        global: false,
        models: {},
        effects: {},
        errors: {}
    };

    const reducers = {
        [namespace](state = initialState, { type, payload }) {
            const { namespace, actionType, error } = payload || {};
            let ret;
            switch (type) {
                case SHOW:
                    ret = {
                        ...state,
                        global: true,
                        models: { ...state.models, [namespace]: true },
                        effects: { ...state.effects, [actionType]: true },
                        errors: { ...state.errors, [actionType]: error || '' },
                    };
                    break;
                case HIDE:
                    const effects = { ...state.effects, [actionType]: false };
                    const models = {
                        ...state.models,
                        [namespace]: Object.keys(effects).some((effect) => effect.indexOf(`${namespace}/`) > -1 && effects[effect]) 
                    };
                    const global = Object.keys(models).some((namespace) => models[namespace]);
                    ret = {
                        ...state,
                        global,
                        models,
                        effects,
                        errors: { ...state.errors, [actionType]: error || '' },
                    };
                    break;
                default:
                    ret = state;
                    break;
            }
            return ret;
        },
    };

    function onEffect(effect, { put }, model, actionType) {
        const { namespace } = model;
        return function* (...args) {
            try {
                yield put({ type: SHOW, payload: { namespace, actionType } });
                yield effect(...args);
                yield put({ type: HIDE, payload: { namespace, actionType } });
            } catch(error) {
                yield put({ type: HIDE, payload: { namespace, actionType, error } });
            }
        };
    }

    return {
        reducers,
        onEffect,
    };
}
export default createLoading;

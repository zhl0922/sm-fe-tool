import { applyMiddleware, createStore } from 'redux';
export default ({ initialState, reducers, middlewares }) => {
    const store = createStore(
        reducers,
        initialState,
        applyMiddleware(...middlewares)
    );
    return store;
}
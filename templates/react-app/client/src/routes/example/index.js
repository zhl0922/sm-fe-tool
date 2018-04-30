export default modelCore => asyncComponent({
    modelCore,
    component: () => import('./containers'),
    models: () => [
    ]
})
// from dva
export default function prefixType(type, model) {
    const prefixedType = `${model.namespace}/${type}`;
    const typeWithoutAffix = prefixedType.replace(/\/@@[^/]+?$/, '');
    if ((model.reducers && model.reducers[typeWithoutAffix])
        || (model.effects && model.effects[typeWithoutAffix])) {
        return prefixedType;
    }
    return type;
}

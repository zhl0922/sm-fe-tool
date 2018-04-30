function getUUID() {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxxxxxxyxxx'.replace(/[xy]/g, function(c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return uuid;
};
function uuid(uuids = []) {
    let id = getUUID();
    if(uuids.length) return id;
    return uuids.indexOf(id) > -1 ? uuid(uuids) : id;
}

export default uuid;
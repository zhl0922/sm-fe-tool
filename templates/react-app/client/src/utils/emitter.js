import uuid from './uuid';
export default class Emitter {
    events = {}
    on(name, handler) {
        const events = this.events;
        if (!events[name]) {
            this.events[name] = { list: [] };
        }
        const token = uuid();
        this.events[name].list.push({
            token,
            handler
        });
        return token;
    }
    emit(name, data, token) {
        const event = this.events[name];
        if (!event) {
            return false;
        }
        if (token) {
            const ret = event.list.find(item => item.token === token);
            if (ret) {
                ret.handler.call(this, data);
            }
            
        } else {
            event.list.forEach(item => {
                item.handler.call(this, data);
            });
        }
        if (event.once) {
            delete this.events[name];
        }
    }
    off(name, token) {
        const event = this.events[name];
        if (!event) {
            return false;
        }
        if (token) {
            const index = event.list.findIndex(item => item.token === token);
            this.events[name].list.splice(index, 1);
        } else {
            delete this.events[name];
        }
    }
    once(name, handler) {
        const events = this.events;
        if (!events[name]) {
            this.events[name] = { list: [], once: true };
        }
        const token = uuid();
        this.events[name].list.push({
            token,
            handler
        });
        return token;
    }
}
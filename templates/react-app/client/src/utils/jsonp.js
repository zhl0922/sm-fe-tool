/**
 * jsonp
 */
import qs from 'querystring';
import uuid from './uuid';
function removeFn(fnId) {
    try {
        delete window[fnId];
    } catch (e) {
        window[fnId] = null;
    }
}
function removeScript(script) {
    script.parentNode.removeChild(script);
}
function clearTimeoutTimer(timeoutId) {
    timeoutId && clearTimeout(timeoutId);;
}
export default function jsonp(opt = {}) {
    const opts = {
        url: '',
        timeout: 50000,
        jsonpCallback: 'jsonpcallback',
        data: {},
        callbackName: null,
        ...opt
    };
    let { url, timeout, jsonpCallback, callbackName, data } = opts;
    const script = document.createElement('script');
    const fnId = callbackName || `jsonp_${uuid()}`;
    script.id = fnId;

    let timeoutId;
    
    url += (url.indexOf('?') === -1) ? '?' : '&';
    url = `${url}${qs.stringify(data)}&${jsonpCallback}=${fnId}`;
    script.src = url;

    return new Promise((resolve, reject) => {
        window[fnId] = (res => {
            resolve(res);
            clearTimeoutTimer(timeoutId);
            removeScript(script);
            removeFn(fnId);
        });

        timeoutId = setTimeout(() => {
            reject('request time out');
            removeScript(script);
            removeFn(fnId);
            window[fnId] = () => {
                removeFn(fnId);
            };
        }, timeout);

        script.onerror = () => {
            reject('requerst failed');
            clearTimeoutTimer(timeoutId);
            removeScript(script);
            removeFn(fnId);
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    });
}

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    return {
        babel: {
            presets: [(0, _utils.resolve)('babel-preset-react')],
            plugins: [(0, _utils.resolve)('babel-plugin-transform-react-remove-prop-types')]
        }
    };
};

var _utils = require('../utils');

module.exports = exports['default'];
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function (data) {
    return new Promise(function (resolve, reject) {
        if ((typeof data === "undefined" ? "undefined" : _typeof(data)) === _typeof({})) {
            return resolve(data);
        }
        try {
            resolve(JSON.parse(data));
        } catch (e) {
            reject(e);
        }
    });
};
//# sourceMappingURL=index.js.map

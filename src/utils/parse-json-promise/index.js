module.exports = function (data) {
    return new Promise((resolve, reject) => {
        if (typeof data === typeof {}) {
            return resolve(data);
        }
        try {
            resolve(JSON.parse(data));
        } catch (e) {
            reject(e);
        }
    })
};
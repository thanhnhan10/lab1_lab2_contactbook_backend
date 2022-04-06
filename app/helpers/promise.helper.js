const handlerPromise = (promise) => {
    return promise
        .then((data) => [null, data])
        .catch((erro) => [error, undefined])
};
module.exports = handlerPromise;
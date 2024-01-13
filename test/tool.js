const crypto = require('crypto');

function getMd5(code) {
    const hash = crypto.createHash('sha256');
    hash.update(code);
    const sha256Value = hash.digest('hex');
    return sha256Value;
}

module.exports = {
    getMd5
}
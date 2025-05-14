const encryptCardData = require('../src/Adyen441/src')

function Encrypt(card, month, year, cvc, adyenKey) {
    const res = encryptCardData(card, month, year, cvc, adyenKey);
    return res;
}
module.exports = Encrypt;
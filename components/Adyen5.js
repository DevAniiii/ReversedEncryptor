const encryptCardData = require('../src/Adyen5');

function Encrypt(card, month, year, cvc, adyenKey) {
    const res = encryptCardData(card, month, year, cvc, adyenKey);
    return res;
}
module.exports = Encrypt;
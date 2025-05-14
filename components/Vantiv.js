const crypto = require('crypto');
const forge = require('node-forge');

function encryptData(data, modulusHex) {
    const exponentHex = '10001';
    const n = new forge.jsbn.BigInteger(modulusHex, 16);
    const e = new forge.jsbn.BigInteger(exponentHex, 16);
    const publicKey = forge.pki.rsa.setPublicKey(n, e);
    const pem = forge.pki.publicKeyToPem(publicKey);
    const buffer = Buffer.from(data, 'utf8');
    const encrypted = crypto.publicEncrypt({
        key: pem,
        padding: crypto.constants.RSA_PKCS1_PADDING
    }, buffer);
    const base64 = encrypted.toString('base64');
    return base64;
}

// const modulus = 'bc4aa59e76c5b4feb834c06654528fac7353565fd6b779ccc5b5e65efd1d02c0c87e8cfed08421680c5a2cfe4b247e671c92294de7b441e6ddf8092c4e388d30f4ca7f6fba5684fc0b4627c1e97efbb5c848ff9dc49ca5408da53d50fb18a1d7885db67f953a3382f5e26a83cb7d5c7e64a29469f5af0bdb481cbc0cf496be3dffdebe3459e8f24671e56522f4d979f3f4ef57a1c16b2b18347222ebbccc8c05bd049b20ed7c139247a2d134e1606c69cf11931a56dc1f7d9f7a97d039d490bac46a7d8cc2574613c11d99349329f3e7e23e54c40abbe422e94074288189045ffaa7c3a7f7aa3b4c3332cb897a5a21d03839b396caff459ba681a366ffad3a75';

// const encryptedData = encryptData('5363500007309452', modulus);
// console.log('Encrypted Data:', encryptedData);

module.exports = encryptData;
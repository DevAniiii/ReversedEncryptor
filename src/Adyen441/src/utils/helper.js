function getCurrentTimestamp() {
    return new Date().toISOString();
}

function w(e) {
    var t = e;
    if (typeof t === 'string') {
        t = Buffer.from(t);
    }
    var r = [];
    for (var n = 0; n < t.length; n += 32768)
        r.push(String.fromCharCode.apply(null, t.subarray(n, n + 32768)));
    return Buffer.from(r.join(''), 'binary').toString('base64');
}

function _(e) {
    return w(e).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function k(e) {
    if (!e)
        return new Uint8Array(0);
    e.length % 2 == 1 && (e = "0" + e);
    for (var t = e.length / 2, r = new Uint8Array(t), n = 0; n < t; n++)
        r[n] = parseInt(e.substr(2 * n, 2), 16);
    return r
}

module.exports = {
    w,
    _,
    k,
    getCurrentTimestamp
};
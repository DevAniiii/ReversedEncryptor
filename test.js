const JSEncrypt = require("node-jsencrypt");
// import JSEncrypt from 'jsencrypt';

const RSA_PUBLIC_KEY = `
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAt9NyTMvdhbfsoI/+GBwEHC4dw6vSuKQj+JGeBy0pVkbdaYoTAisExt2wVPgkbOotPwa7/oReV+Wqapeh42ABihrRAXOBLLEhBR8y/mmAGBHKc2rANx8DWgUg1Rr4c5MxAthCDOZCQefyqYD8DMmF3va92GqXvCfnSyISaxidqvcp9W7ymSnFjBm9K7S49cUOD3A4CBnj8ikndUsS1TypXHn8KS9f6MOYI+lYioUJU+Z+9HVx0RAtP+Tk6jPk7+pteEtPlL5GWSLM1if+BwUUaek83TNHE2o0mslX7szkVPkPBJ9k9XmmI3i2wDhZO/Rz63E/rx6/f1oKmDM32YxamQIDAQAB
`;

function generateAurusPayload(params = {}) {
  const defaults = {
    merchantId: "101231196962",
    terminalId: "82317986",
    storeId: "00040403",
    sessionId: "304805325114247320039289130652",
    card: "4941750051118705",
    expMonth: "12",
    expYear: "25",
    cvv: "123",
  };

  const config = { ...defaults, ...params };

  const payload = {
    // Merchant Information
    1.1: config.merchantId,
    1.2: config.storeId,
    1.3: config.terminalId,
    1.4: config.corporateId,

    // Session/Transaction Info
    12.63: config.sessionId,
    12.74: config.domainId,
    12.71: "WEB",
    12.132: "PAYMENT",

    // Transaction Details
    4.1: "102",
    4.2: "000000",
    4.3: "3",
    4.4: generateCardToken(config), // RSA Encrypted
    4.15: "5",
    4.18: formatDate(),
    4.19: formatTime(),
    "4.20": "840",

    // System Information
    2.3: getIpAddress(),
    "2.4.1": getIpAddress(),
    "2.4.2": getPlatform(),
    "2.4.4": getUserAgent(),
    "2.4.5": getScreenResolution(),
    "2.4.7": getBrowserLang(),

    // Network & Device Info
    "2.4.12": getNetworkType(),
    "2.4.13": getNetworkEffType(),
    "2.4.14": getNetworkDownlink(),
    "2.4.15": getNetworkMaxDownlink(),
    "2.4.16": isJavaEnabled(),
    "2.4.17": getScreenColorDepth(),
    "2.4.18": getDeviceCategory(),
    "2.4.19": getDeviceSubCategory(),
    "2.4.20": getBrowserResolution(),
    "2.4.21": getTotalLoadTime(),
    "2.4.22": `${getDeviceCategory()} ${getDeviceSubCategory()}`,
    "2.4.23": getMobileDeviceInfo(),

    // API Version
    3.7: "1.0",
    12.128: "10",
    3.4: config.languageIndicator,
    3.21: config.apiVersion,
    4.58: "000",
  };

  const jsonPayload = JSON.stringify(payload);
  const hexPayload = toHex(jsonPayload);
  return `STX${hexPayload}ETX`;
}

// RSA Encryption for Card Data
function generateCardToken(config) {
  const raw = `${config.card}%1D${config.expMonth}${config.expYear}%1D${config.cvv}`;
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(RSA_PUBLIC_KEY);
  const encrypted = encrypt.encrypt(raw);

  if (!encrypted) {
    console.error("RSA encryption failed");
    return "";
  }
  return `${raw.length}|${encrypted}`;
}

// Browser-based Helper Functions
function getIpAddress() {
  return "127.0.0.1"; // Replace with actual client IP detection in browser
}

function getPlatform() {
  return navigator.platform || "Unknown";
}

function getNetworkType() {
  return "4g"; // Implement network detection
}

function getScreenResolution() {
  if (typeof window !== "undefined" && window.screen) {
    return `${window.screen.width}x${window.screen.height}`;
  }
  return "1366x768"; // default value
}

function getBrowserLang() {
  return navigator.language || "en-US";
}

function getUserAgent() {
  return navigator.userAgent;
}

function formatDate() {
  const date = new Date();
  return (
    String(date.getMonth() + 1).padStart(2, "0") +
    String(date.getDate()).padStart(2, "0") +
    date.getFullYear()
  );
}
function getNetworkEffType() {
  return "4g"; // Implement effective network type detection
}

function getNetworkDownlink() {
  return "10.0"; // Implement downlink speed detection
}

function getNetworkMaxDownlink() {
  return "100.0"; // Implement max downlink detection
}

function isJavaEnabled() {
  return "false"; // Check Java capability
}

function getScreenColorDepth() {
  return "24"; // Implement color depth detection
}

function getDeviceCategory() {
  return "Desktop"; // Implement device detection
}

function getDeviceSubCategory() {
  return "Windows"; // Implement OS detection
}

function getBrowserResolution() {
  return "1900x950"; // Implement browser window size detection
}

function getTotalLoadTime() {
  return "1500"; // Implement page load time calculation
}

function getMobileDeviceInfo() {
  return ""; // Implement mobile device detection
}

// Format time as HHMMSS
function formatTime() {
  const date = new Date();
  return (
    String(date.getHours()).padStart(2, "0") +
    String(date.getMinutes()).padStart(2, "0") +
    String(date.getSeconds()).padStart(2, "0")
  );
}

// Convert to Hex
function toHex(str) {
  return Buffer.from(str, "utf8").toString("hex");
}

// Example Usage
console.log("Generated Payload:");
console.log(
  generateAurusPayload({
    merchantId: "MhkB3k4oet3o",
    terminalId: "TERM456",
    card: "4941750051118705",
    expMonth: "12",
    expYear: "25",
  })
);

import Cors from "cors";
// const GenRiskData = require('../../components/Adyen-RiskData');
import GenRiskData from '../../components/RiskData'
import { trackRequest } from './stats';

const cors = Cors({
  methods: ["POST"],
  origin: process.env.NEXT_PUBLIC_API_BASE_URL || "*",
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  const { card, month, year, cvc, adyenKey, version } = req.body;

  // Validate all required fields
  const requiredFields = [
    "card",
    "month",
    "year",
    "cvc",
    "adyenKey",
    "version",
  ];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      error: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  // Validate supported versions
  const supportedVersions = ["4.4.1", "5.11.0", "4.5.0"];
  if (!supportedVersions.includes(version)) {
    return res.status(400).json({
      success: false,
      error: `Unsupported version. Supported versions: ${supportedVersions.join(
        ", "
      )}`,
    });
  }

  try {
    trackRequest(version, true);
    let encryptedData;
    const riskData = GenRiskData();
    switch (version) {
      case "4.4.1": {
        const adyenModule = await import("../../components/Adyen441");
        encryptedData = adyenModule.default(card, month, year, cvc, adyenKey);
        break;
      }
      case "5.11.0": {
        const adyenModule = await import("../../components/Adyen5");
        encryptedData = adyenModule.default(card, month, year, cvc, adyenKey);
        break;
      }
      case "4.5.0": {
        const adyenModule = await import("../../components/Adyen450");
        encryptedData = adyenModule.default(card, month, year, cvc, adyenKey);
        break;
      }
      default: {
        throw new Error("Unsupported version");
      }
    }

    res.status(200).json({
      author: "@OriginalAni",
      version,
      encryptedData,
      riskdata: riskData
    });
  } catch (error) {
    trackRequest(version, false);
    console.error("Encryption error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to encrypt card data",
      version,
      details: error.message,
    });
  }
}

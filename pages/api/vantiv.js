import Cors from "cors";
import { trackRequest } from "./stats";

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

  const { card, month, year, cvc, modulus , version } = req.body;

  // Validate required fields
  const requiredFields = [
    "modulus",
    "version",
  ];
  const missingFields = requiredFields.filter((field) => !req.body[field]);
  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      error: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }
  const supportedVersions = ["vantiv"];
  if (!supportedVersions.includes(version)) {
    return res.status(400).json({
      success: false,
      error: `Unsupported version. Supported versions: ${supportedVersions.join(
        ", "
      )}`,
    });
  }
  try {
    // Track request if needed
    trackRequest(version, true);

    const Vantiv = await import("../../components/Vantiv");
    const encryptedData = {};

    // Encrypt each field if provided
    if (card) encryptedData.card = Vantiv.default(card, modulus);
    if (month) encryptedData.month = Vantiv.default(month, modulus);
    if (year) encryptedData.year = Vantiv.default(year, modulus);
    if (cvc) encryptedData.cvc = Vantiv.default(cvc, modulus);

    res.status(200).json({
      author: "@OriginalAni",
      encryptedData,
    });
  } catch (error) {
    // Track failure if needed
    trackRequest(version, false);
    console.error("Encryption error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to encrypt card data",
      details: error.message,
    });
  }
}
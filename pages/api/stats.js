
import mongoose from "mongoose";
import 'dotenv/config';
const mongo = process.env.MONGODB_URI;


const statsSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: "stats",
  },
  totalRequests: {
    type: Number,
    default: 0,
  },
  successfulRequests: {
    type: Number,
    default: 0,
  },
  versionDistribution: {
    type: Object, // changed from Map to Object
    default: {},
  },
  currentVersion: {
    type: String,
    default: "5.11.0",
  },
});


const Stats = mongoose.models.Stats || mongoose.model("Stats", statsSchema);

const MONGODB_URI = mongo;
// In trackRequest function
export async function trackRequest(version, success) {
  try {
    await mongoose.connect(MONGODB_URI);

    // Replace dots in version to avoid MongoDB nested keys
    const safeVersion = version.replace(/\./g, '_');

    const update = {
      $inc: {
        totalRequests: 1,
        successfulRequests: success ? 1 : 0,
        [`versionDistribution.${safeVersion}`]: 1,
      },
      $set: {
        currentVersion: version,
      },
    };

    await Stats.findByIdAndUpdate(
      "stats",
      update,
      { upsert: true }
    );
  } catch (error) {
    console.error("Error tracking request:", error);
    throw error;
  }
}

// In handler function
export default async function handler(req, res) {
  try {
    await mongoose.connect(MONGODB_URI);

    let statsDoc = await Stats.findById('stats');

    if (!statsDoc) {
      return res.status(200).json({
        totalRequests: 0,
        successfulRequests: 0,
        versionDistribution: {},
        currentVersion: "5.11.0",
        successRate: 0
      });
    }

    const totalRequests = statsDoc.totalRequests || 0;
    const successfulRequests = statsDoc.successfulRequests || 0;
    const successRate = totalRequests > 0 
      ? Math.round((successfulRequests / totalRequests) * 100)
      : 0;

    // Convert versionDistribution keys back to original versions
    let versionDistributionObj = {};
    if (statsDoc.versionDistribution instanceof Map) {
      versionDistributionObj = Object.fromEntries(statsDoc.versionDistribution.entries());
    } else if (statsDoc.versionDistribution) {
      versionDistributionObj = statsDoc.versionDistribution;
    }

    // Replace underscores with dots in version keys
    const convertedVersionDistribution = {};
    for (const [key, value] of Object.entries(versionDistributionObj)) {
      convertedVersionDistribution[key.replace(/_/g, '.')] = value;
    }

    res.status(200).json({
      totalRequests,
      successfulRequests,
      currentVersion: statsDoc.currentVersion || "5.11.0",
      versionDistribution: convertedVersionDistribution,
      successRate
    });
  } catch (error) {
    console.error('Error handling stats request:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
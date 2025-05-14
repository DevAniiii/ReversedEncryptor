"use client";
import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";

ChartJS.register(
  Tooltip,
  Legend,
  ArcElement
);

const statsConfig = [
  { 
    key: 'totalRequests', 
    label: 'Total Requests', 
    color: 'teal-400',
    format: (value) => value.toLocaleString()
  },
  { 
    key: 'successRate', 
    label: 'Success Rate', 
    color: 'green-400',
    format: (value) => `${value?.toFixed(2) || 0}%`
  },
  { 
    key: 'currentVersion', 
    label: 'Active Version', 
    color: 'purple-400',
    format: (value) => value || 'N/A'
  },
];

const colors = [
  'rgba(99, 102, 241, 0.8)',
  'rgba(239, 68, 68, 0.8)',
  'rgba(16, 185, 129, 0.8)',
  'rgba(245, 158, 11, 0.8)',
  'rgba(139, 92, 246, 0.8)',
];

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      const response = await axios.get("/api/stats");
      setStats(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error("Stats error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const pieData = {
    labels: stats.versionDistribution ? Object.keys(stats.versionDistribution) : [],
    datasets: [
      {
        data: stats.versionDistribution ? Object.values(stats.versionDistribution) : [],
        backgroundColor: stats.versionDistribution ? 
          Object.keys(stats.versionDistribution).map((_, i) => colors[i % colors.length]) : [],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
          Adyen Encryption API Dashboard
        </h1>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto"></div>
          </div>
        ) : error ? (
          <div className="p-4 mb-8 bg-red-900/30 rounded-lg border border-red-400/50">
            ⚠️ {error}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pb-8">
            {/* Dynamic Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {statsConfig.map(({ key, label, color, format }) => (
                <div 
                  key={key}
                  className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/30 hover:border-teal-400/30 transition-all"
                >
                  <h3 className="text-gray-400 mb-2">{label}</h3>
                  <p className={`text-3xl font-bold text-${color}`}>
                    {format(stats[key])}
                  </p>
                </div>
              ))}
            </div>

            {/* Dynamic Charts Grid */}
            <div className="grid grid-cols-1 gap-6 mb-8">
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/30 h-96">
                <h3 className="text-xl font-semibold mb-4">
                  Version Distribution
                </h3>
                <div className="h-80">
                  {pieData.labels?.length > 0 ? (
                    <Pie
                      data={pieData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { 
                          legend: { 
                            labels: { 
                              color: "#fff",
                              font: {
                                size: 14
                              }
                            } 
                          } 
                        },
                      }}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      No version data available
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Dynamic API Documentation */}
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/30">
              <h2 className="text-2xl font-semibold mb-4">Adyen Documentation</h2>
              <div className="p-4 bg-gray-900 rounded-lg overflow-x-auto">
                <pre className="text-sm whitespace-pre-wrap break-words">
                  {`Versions available: [4.4.1(JWT), 4.5.0(JWT), 5.11.0[CSE]]\n`}
                  {`POST /api/encrypt\n`}
                  {`Content-Type: application/json\n`}
                  {JSON.stringify(
                    {
                      card: "4242424242424242",
                      month: "12",
                      year: "2023",
                      cvc: "123",
                      adyenKey: "your_public_key_here",
                      version: stats.versionDistribution?.currentVersion || 'put version(4.4.1)',
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/30">
              <h2 className="text-2xl font-semibold mb-4">Vantiv Documentation</h2>
              <div className="p-4 bg-gray-900 rounded-lg overflow-x-auto">
                <pre className="text-sm whitespace-pre-wrap break-words">
                  {/* {`Versions available: [4.4.1(JWT), 4.5.0(JWT), 5.11.0[CSE]]\n`} */}
                  {`POST /api/vantiv\n`}
                  {`Content-Type: application/json\n`}
                  {JSON.stringify(
                    {
                      card: "4242424242424242",
                      month: "12",
                      year: "2023",
                      cvc: "123",
                      modulus: "your_modulus_here",
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
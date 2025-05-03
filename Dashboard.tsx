import { useState, useEffect } from "react";
import {
  Bell,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// Mock data generator functions
const generateMockData = () => {
  const now = new Date();
  const timestamp = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    temperature: Math.floor(Math.random() * 15) + 65,
    traffic: Math.floor(Math.random() * 200) + 800,
    visitors: Math.floor(Math.random() * 50) + 100,
    timestamp,
  };
};

const generateHistoricalData = (dataPoints = 12) => {
  const data = [];
  const now = new Date();

  for (let i = dataPoints; i > 0; i--) {
    const pastDate = new Date(now.getTime() - i * 5 * 60000);
    const timestamp = pastDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    data.push({
      temperature: Math.floor(Math.random() * 15) + 65,
      traffic: Math.floor(Math.random() * 200) + 800,
      visitors: Math.floor(Math.random() * 50) + 100,
      timestamp,
    });
  }
  return data;
};

const getAlertLevel = (value, type) => {
  switch (type) {
    case "temperature":
      if (value > 77) return "critical";
      if (value > 73) return "warning";
      return "normal";
    case "traffic":
      if (value > 980) return "critical";
      if (value > 950) return "warning";
      return "normal";
    case "visitors":
      if (value > 140) return "critical";
      if (value > 120) return "warning";
      return "normal";
    default:
      return "normal";
  }
};

const StatusIndicator = ({ level }) => {
  const colors = {
    normal: "bg-green-500",
    warning: "bg-yellow-500",
    critical: "bg-red-500",
  };

  return (
    <span className={`inline-block w-3 h-3 rounded-full ${colors[level]} mr-2`}></span>
  );
};

const MetricCard = ({ title, value, unit, previousValue, alertLevel }) => {
  const diff = value - previousValue;
  const isUp = diff >= 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </h3>
        <StatusIndicator level={alertLevel} />
      </div>
      <div className="flex items-baseline">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
        <span className="ml-1 text-gray-500 dark:text-gray-400 text-sm">
          {unit}
        </span>
      </div>
      <div className={`flex items-center mt-2 ${isUp ? "text-red-500" : "text-green-500"}`}>
        {isUp ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
        <span className="text-xs font-medium ml-1">
          {Math.abs(diff)} {isUp ? "increase" : "decrease"}
        </span>
      </div>
    </div>
  );
};

const AlertItem = ({ type, level, value, time }) => {
  const icons = {
    normal: <CheckCircle size={16} className="text-green-500" />,
    warning: <AlertTriangle size={16} className="text-yellow-500" />,
    critical: <XCircle size={16} className="text-red-500" />,
  };

  const typeLabels = {
    temperature: "Temperature",
    traffic: "Network Traffic",
    visitors: "Active Users",
  };

  const units = {
    temperature: "°F",
    traffic: "Mbps",
    visitors: "users",
  };

  const bgColors = {
    normal: "bg-green-50 dark:bg-green-900/20",
    warning: "bg-yellow-50 dark:bg-yellow-900/20",
    critical: "bg-red-50 dark:bg-red-900/20",
  };

  return (
    <div className={`mb-2 p-3 rounded-md ${bgColors[level]} border-l-4 ${
      level === "critical"
        ? "border-red-500"
        : level === "warning"
        ? "border-yellow-500"
        : "border-green-500"
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {icons[level]}
          <span className="ml-2 font-medium text-sm dark:text-gray-300">
            {typeLabels[type]}
          </span>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">{time}</span>
      </div>
      <div className="mt-1">
        <span className="text-sm dark:text-gray-300">
          {value} {units[type]}
        </span>
        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
          {level === "critical"
            ? "Critical threshold exceeded"
            : level === "warning"
            ? "Warning threshold exceeded"
            : "Back to normal range"}
        </span>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentData, setCurrentData] = useState(generateMockData());
  const [previousData, setPreviousData] = useState(generateMockData());
  const [historicalData, setHistoricalData] = useState(generateHistoricalData());
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPreviousData(currentData);
      const newData = generateMockData();
      setCurrentData(newData);

      setHistoricalData((prev) => {
        const newHistory = [...prev, newData];
        if (newHistory.length > 12) {
          return newHistory.slice(1);
        }
        return newHistory;
      });

      const tempLevel = getAlertLevel(newData.temperature, "temperature");
      const trafficLevel = getAlertLevel(newData.traffic, "traffic");
      const visitorLevel = getAlertLevel(newData.visitors, "visitors");

      const newAlerts = [];

      if (tempLevel !== "normal") {
        newAlerts.push({
          type: "temperature",
          level: tempLevel,
          value: newData.temperature,
          time: newData.timestamp,
        });
      }

      if (trafficLevel !== "normal") {
        newAlerts.push({
          type: "traffic",
          level: trafficLevel,
          value: newData.traffic,
          time: newData.timestamp,
        });
      }

      if (visitorLevel !== "normal") {
        newAlerts.push({
          type: "visitors",
          level: visitorLevel,
          value: newData.visitors,
          time: newData.timestamp,
        });
      }

      if (newAlerts.length > 0) {
        setAlerts((prev) => [...newAlerts, ...prev].slice(0, 5));
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [currentData]);

  const temperatureAlertLevel = getAlertLevel(currentData.temperature, "temperature");
  const trafficAlertLevel = getAlertLevel(currentData.traffic, "traffic");
  const visitorAlertLevel = getAlertLevel(currentData.visitors, "visitors");

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Real-time Monitoring Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-md bg-gray-200 dark:bg-gray-700"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
            <div className="relative">
              <Bell size={20} className="text-gray-500 dark:text-gray-400" />
              {alerts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {alerts.length}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Temperature"
            value={currentData.temperature}
            unit="°F"
            previousValue={previousData.temperature}
            alertLevel={temperatureAlertLevel}
          />
          <MetricCard
            title="Network Traffic"
            value={currentData.traffic}
            unit="Mbps"
            previousValue={previousData.traffic}
            alertLevel={trafficAlertLevel}
          />
          <MetricCard
            title="Active Users"
            value={currentData.visitors}
            unit="users"
            previousValue={previousData.visitors}
            alertLevel={visitorAlertLevel}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium mb-4">Temperature Trend</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="timestamp" stroke="#6B7280" />
                  <YAxis domain={[60, 85]} stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#1F2937" : "#FFFFFF",
                      borderColor: darkMode ? "#374151" : "#E5E7EB",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium mb-4">Network & User Activity</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="timestamp" stroke="#6B7280" />
                  <YAxis yAxisId="left" orientation="left" stroke="#10B981" />
                  <YAxis yAxisId="right" orientation="right" stroke="#F59E0B" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#1F2937" : "#FFFFFF",
                      borderColor: darkMode ? "#374151" : "#E5E7EB",
                    }}
                  />
                  <Bar yAxisId="left" dataKey="traffic" fill="#10B981" />
                  <Bar yAxisId="right" dataKey="visitors" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Recent Alerts</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {currentData.timestamp}
            </span>
          </div>

          <div className="space-y-2">
            {alerts.length > 0 ? (
              alerts.map((alert, index) => (
                <AlertItem key={index} {...alert} />
              ))
            ) : (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                <AlertCircle size={24} className="mx-auto mb-2" />
                <p>No recent alerts</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import axios from "axios";

function Home() {
  const [user, setUser] = useState(null);
  const [globalStats, setGlobalStats] = useState({
    totalProblems: 0,
    totalSubmissions: 0,
    totalUsers: 0,
  });
  const [userStats, setUserStats] = useState({
    Easy: 0,
    Medium: 0,
    Hard: 0,
    totalSolved: 0,
  });

  const { darkMode } = useContext(ThemeContext);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch global stats
  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        const res = await axios.get("http://3.111.39.120:5000/api/problemlist", {
          withCredentials: true,
        });
        setGlobalStats((prev) => ({
          ...prev,
          totalProblems: res.data.length,
        }));
      } catch (err) {
        console.error("Error fetching global stats:", err);
      }
    };

    fetchGlobalStats();
  }, []);

  // Fetch user stats
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) return;
      try {
        const res = await axios.get(
          `http://3.111.39.120:5000/api/submissions/${user._id}`,
          { withCredentials: true }
        );

        const submissions = res.data || [];

        const count = { Easy: 0, Medium: 0, Hard: 0 };

        submissions.forEach((s) => {
          if (s.verdict === "Accepted") {
            const difficulty = s.problem?.difficulty;
            if (difficulty) count[difficulty]++;
          }
        });

        setUserStats({
          Easy: count.Easy,
          Medium: count.Medium,
          Hard: count.Hard,
          totalSolved: count.Easy + count.Medium + count.Hard,
        });
      } catch (err) {
        console.error("Error fetching user stats:", err);
      }
    };

    fetchUserStats();
  }, [user]);

  const themeBg = darkMode
    ? "from-[#0f0f0f] to-[#1a1a1a]"
    : "from-white to-gray-200";
  const textColor = darkMode ? "text-white" : "text-black";

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${themeBg} ${textColor} px-4 py-12 transition-colors duration-300`}
    >
      {/* Hero Section */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-4 inline-block px-4 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-sm font-semibold tracking-wider">
          🚀 New Era of Coding
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Master Your Coding Journey
        </h1>
        <p className="text-gray-400 text-lg mb-6">
          Transform your programming skills with our revolutionary platform.
          Practice algorithms, compete with peers, and unlock your coding potential.
        </p>
        <a
          href="/problems"
          className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition"
        >
          Start Coding Now →
        </a>
      </div>

      {/* 🌐 Global Stats */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {[
          {
            label: "Total Problems",
            value: globalStats.totalProblems,
            icon: "💡",
            shadow: "shadow-blue-500/40",
            bg: darkMode ? "bg-[#121d2e]" : "bg-blue-50",
            iconColor: "text-blue-500",
          },
          {
            label: "Active Users",
            value: "100+",
            icon: "👥",
            shadow: "shadow-purple-500/40",
            bg: darkMode ? "bg-[#1c1532]" : "bg-purple-50",
            iconColor: "text-purple-500",
          },
          {
            label: "Solutions",
            value: "200+",
            icon: "✅",
            shadow: "shadow-green-500/40",
            bg: darkMode ? "bg-[#102820]" : "bg-green-50",
            iconColor: "text-green-500",
          },
          {
            label: "Success Rate",
            value: "85%",
            icon: "🎯",
            shadow: "shadow-orange-500/40",
            bg: darkMode ? "bg-[#2e1e10]" : "bg-orange-50",
            iconColor: "text-orange-500",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={`rounded-2xl p-6 transition transform hover:scale-[1.02] duration-300 shadow-lg ${stat.shadow} ${stat.bg}`}
          >
            <div className={`text-3xl mb-3 ${stat.iconColor}`}>{stat.icon}</div>
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-sm mt-1 text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* 👤 User Stats */}
      {user && (
        <div
          className={`mt-12 max-w-4xl mx-auto ${
            darkMode ? "bg-[#121212] text-white" : "bg-gray-100 text-black"
          } p-6 rounded-2xl shadow-lg`}
        >
          <h2 className="text-lg font-semibold mb-6">
            Welcome back, {user.username}! 🚀
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Total Solved",
                value: userStats.totalSolved,
                icon: "🏆",
                shadow: "shadow-yellow-500/40",
                color: "text-yellow-500",
              },
              {
                label: "Easy",
                value: userStats.Easy,
                icon: "✅",
                shadow: "shadow-green-500/40",
                color: "text-green-500",
              },
              {
                label: "Medium",
                value: userStats.Medium,
                icon: "🟡",
                shadow: "shadow-yellow-300/40",
                color: "text-yellow-300",
              },
              {
                label: "Hard",
                value: userStats.Hard,
                icon: "🔴",
                shadow: "shadow-red-500/40",
                color: "text-red-500",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`text-center py-4 px-2 rounded-xl shadow-md hover:shadow-lg ${item.shadow} ${
                  darkMode ? "bg-[#1f1f1f]" : "bg-white"
                }`}
              >
                <div className={`text-2xl mb-1 ${item.color}`}>{item.icon}</div>
                <p className="text-xl font-bold">{item.value}</p>
                <p className="text-sm text-gray-400">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;

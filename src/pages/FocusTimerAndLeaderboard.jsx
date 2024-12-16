import { useState, useEffect } from "react";
import {
  getDatabase,
  ref,
  onValue,
  push,
  set,
  serverTimestamp,
} from "firebase/database";
import { auth } from "../config/firebaseConfig";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import Lottie from "lottie-react";
import startOfJourneyAnimation from "../assets/animations/StartoftheJourney.json";
import toTheMoon from "../assets/animations/tothemoon.json";
import babyAstro from "../assets/animations/babyastro.json";
import rocket from "../assets/animations/rocket.json";
import lostinspace from "../assets/animations/lostinspace.json";
import focuserror from "../assets/animations/404.json";
import coldfire from "../assets/animations/coldfire.json";
import timer from "../assets/animations/timer.json";
function FocusTimerAndLeaderboard() {
  const [time, setTime] = useState(25 * 60); // Default to 25 minutes
  const [isActive, setIsActive] = useState(false);
  const [leaderboard, setLeaderboard] = useState({ today: [], last7Days: [] });
  const [achievements, setAchievements] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [weeklyFocusData, setWeeklyFocusData] = useState([]);
  const [streak, setStreak] = useState(0);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Failed to enter fullscreen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error(`Failed to exit fullscreen mode: ${err.message}`);
      });
    }
    setIsFullscreen(!isFullscreen);
  };
  


  const user = auth.currentUser;

  const achievementAnimations = {
    "🧑‍🚀 25 minutes": babyAstro,
    "🔥 50 minutes": toTheMoon,
    "🏆 75 minutes": rocket,
    "🚀 100 minutes": lostinspace,
    "🌟 125 minutes": focuserror,
  };
  // Start or pause the timer
  const toggleTimer = () => setIsActive(!isActive);
  
  // Save focus session data to Firebase
  const saveFocusSession = async (elapsedTime) => {
    if (!user) {
      alert("You need to log in to save your focus session.");
      return;
    }

    setIsSaving(true);
    const db = getDatabase();
    const focusSessionsRef = ref(db, "focus_sessions");
    const sessionToSave = {
      userId: user.uid,
      username: user.displayName || "Anonymous",
      focusedTime: elapsedTime,
      createdAt: serverTimestamp(),
    };

    try {
      const newSessionRef = push(focusSessionsRef);
      await set(newSessionRef, sessionToSave);
      alert("Focus session saved successfully!");
    } catch (error) {
      console.error("Error saving focus session:", error);
      alert("Failed to save focus session. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Fetch leaderboard data and weekly focus data from Firebase
  useEffect(() => {
    const db = getDatabase();
    const focusSessionsRef = ref(db, "focus_sessions");

    onValue(focusSessionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const now = new Date();
        const todayStart = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        ).getTime();
        const last7DaysStart = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 6
        ).getTime();

        const todayData = {};
        const last7DaysData = {};
        const weeklyData = Array(7).fill(0); // Weekly data for the logged-in user

        let userStreak = 0;
        let userPomodoros = 0;
        let previousDay = null;

        Object.keys(data).forEach((key) => {
          const session = data[key];
          const timestamp = session.createdAt;

          if (timestamp) {
            const sessionDate = new Date(timestamp);
            const dayIndex = (sessionDate.getDay() + 6) % 7; // Convert Sunday (0) to last index (6)

            // Process leaderboard data for all users
            if (timestamp >= todayStart) {
              if (!todayData[session.userId]) {
                todayData[session.userId] = {
                  username: session.username,
                  totalFocusedTime: 0,
                  pomodoros: 0,
                };
              }
              todayData[session.userId].totalFocusedTime += session.focusedTime;
              todayData[session.userId].pomodoros += Math.floor(
                session.focusedTime / (25 * 60)
              );
            }

            if (timestamp >= last7DaysStart) {
              if (!last7DaysData[session.userId]) {
                last7DaysData[session.userId] = {
                  username: session.username,
                  totalFocusedTime: 0,
                  pomodoros: 0,
                };
              }
              last7DaysData[session.userId].totalFocusedTime +=
                session.focusedTime;
              last7DaysData[session.userId].pomodoros += Math.floor(
                session.focusedTime / (25 * 60)
              );

              // Add focused time to the respective day for the logged-in user
              if (user && session.userId === user.uid) {
                weeklyData[dayIndex] += session.focusedTime / 60; // Convert to minutes

                userPomodoros += Math.floor(session.focusedTime / (25 * 60));

                const currentDay = sessionDate.getDate();
                if (previousDay === null || currentDay === previousDay + 1) {
                  userStreak += 1;
                } else if (currentDay !== previousDay) {
                  userStreak = 1; // Reset streak if there's a gap
                }

                previousDay = currentDay;
              }
            }
          }
        });

        const sortLeaderboard = (data) =>
          Object.values(data).sort(
            (a, b) => b.totalFocusedTime - a.totalFocusedTime
          );

        // Update leaderboard for all users
        setLeaderboard({
          today: sortLeaderboard(todayData),
          last7Days: sortLeaderboard(last7DaysData),
        });

        // Update weekly progress for the logged-in user
        setWeeklyFocusData(weeklyData);

        // Update streak and pomodoros for the current user
        setStreak(userStreak);
        setPomodorosCompleted(userPomodoros);

        // Update achievements for the current user
        if (user) {
          const userTodayData = todayData[user.uid] || { totalFocusedTime: 0 };
          const totalMinutes = Math.floor(userTodayData.totalFocusedTime / 60);
          const unlockedAchievements = [];
          if (totalMinutes >= 25) unlockedAchievements.push("🧑‍🚀 25 minutes");
          if (totalMinutes >= 50) unlockedAchievements.push("🔥 50 minutes");
          if (totalMinutes >= 75) unlockedAchievements.push("🏆 75 minutes");
          if (totalMinutes >= 100) unlockedAchievements.push("🚀 100 minutes");
          if (totalMinutes >= 125) unlockedAchievements.push("🌟 125 minutes");
          setAchievements(unlockedAchievements);
        }
      } else {
        setLeaderboard({ today: [], last7Days: [] });
        setWeeklyFocusData(Array(7).fill(0));
      }
    });
  }, [user]);

  // Timer effect (counts down when active)
  useEffect(() => {
    let timer;
    if (isActive && time > 0) {
      timer = setInterval(() => setTime((prev) => prev - 1), 1000);
    } else if (time === 0) {
      setIsActive(false);
      saveFocusSession(25 * 60); // Save the session when the timer ends
    }
    return () => clearInterval(timer);
  }, [isActive, time]);

  // Pause and save elapsed time manually
  const handlePauseAndSave = () => {
    const elapsedTime = 25 * 60 - time;
    saveFocusSession(elapsedTime);
    setTime(25 * 60);
    setIsActive(false);
  };
  // Reset the timer to the default value
  const resetTimer = () => {
    setTime(25 * 60);
    setIsActive(false);
  };

  const getPositionEmoji = (position) => {
    const emojis = ["🏆", "🥈", "🥉", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
    return emojis[position - 1] || position;
  };

  return isFullscreen ? (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div>
        <h2 className="text-3xl font-semibold mb-4">Focus Timer ⏱</h2>
        <div className="text-9xl font-bold">{`${Math.floor(time / 60)}:${String(time % 60).padStart(2, "0")}`}</div>
        <button
          onClick={toggleFullscreen}
          className="bg-purple-600 text-white px-6 py-2 mt-4 rounded-lg shadow-md hover:bg-purple-500"
        >
          Exit Fullscreen
        </button>
      </div>
    </div>
  ) : (
    <div className="container mx-auto p-6 max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Section */}
        <div className="md:col-span-2">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <h1 className="text-2xl font-bold flex items-center">
          🔔 Focus Timer & Leaderboard
            </h1>

            {/* User Greeting */}
            {user && (
          <div className="flex items-center">
            <img
              src={user.photoURL}
              alt="User Avatar"
              className="w-16 h-16 rounded-full mr-4"
            />
            <div className="text-center md:text-left">
              <h2 className="text-xl font-semibold">
            Welcome, {user.displayName || "User"}!
              </h2>
              <p className="text-gray-600">Time to focus and be productive!</p>
            </div>
          </div>
            )}
          </div>

          {/* Timer Section */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Focus Timer ⏱</h2>
          <div className="text-7xl font-bold mb-4 bg-gray-100 p-4 rounded-lg shadow-lg">
            {`${Math.floor(time / 60)}:${String(time % 60).padStart(2, "0")}`}
          </div>
          <div>
            <button
              onClick={toggleTimer}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg mr-2 shadow-md hover:bg-blue-500"
            >
              {isActive ? "Pause" : "Start"}
            </button>
            <button
              onClick={handlePauseAndSave}
              className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-500"
            >
              Save & Reset
            </button>
            <button
              onClick={resetTimer}
              className="bg-gray-500 text-white px-6 py-2 ml-2 rounded-lg shadow-md hover:bg-gray-600"
            >
              Reset
            </button>
            <button
  onClick={toggleFullscreen}
  className="bg-purple-600 text-white px-6 py-2 ml-2 rounded-lg shadow-md hover:bg-purple-500"
>
  {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
</button>

          </div>
        </div>

        {/* Streak and Pomodoros Section */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-2xl font-semibold mb-4">🔥Current Streak </h2>
              <div className="bg-gray-100 p-4 rounded-lg shadow-lg text-center">
                <Lottie
                  animationData={coldfire}
                  loop={true}
                  autoplay={true}
                  style={{ width: 200, height: 100, margin: "0 auto" }}
                />
                <span className="text-2xl font-bold">{streak} Days</span>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">🍅 Pomodoros Completed </h2>
              <div className="bg-gray-100 p-4 rounded-lg shadow-lg text-center">
                <Lottie
                  animationData={timer}
                  loop={true}
                  autoplay={true}
                  style={{ width: 200, height: 100, margin: "0 auto" }}
                />
                <span className="text-2xl font-bold">{pomodorosCompleted}</span>
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="mb-8">
          {/* <h2 className="text-2xl font-semibold mb-4">Achievements 🎉</h2> */}
          <div className=" p-4">
            {achievements.length > 0 ? (
              
              <div></div>
            ): <div className="flex items-center space-x-4">
            <Lottie
              animationData={startOfJourneyAnimation}
              loop={true}
              autoplay={true}
              style={{ width: 100, height: 100 }}
            />
            <span>No achievements unlocked yet. Keep focusing!</span>
          </div>}
          </div>
        </div>
        {/* Progress Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Achievements 🚀</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.keys(achievementAnimations).map((achievement, index) => (
              <div
                key={index}
                className={`bg-gray-100 p-4 rounded-lg shadow-lg text-center ${
                  achievements.includes(achievement) ? "border-4 border-green-500" : ""
                }`}
              >
                <Lottie
                  animationData={achievementAnimations[achievement]}
                  loop={true}
                  autoplay={true}
                  style={{ width: 120, height: 120, margin: "0 auto" }}
                />
                <span className="block mt-4">{achievement}</span>
              </div>
            ))}
          </div>
        </div>
              </div>

              {/* Right Section */}
      <div className="md:col-span-1">
        <h2 className="text-2xl font-semibold mb-6">Leaderboard 🏆</h2>

        {/* Today Leaderboard */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Today</h3>
          <ul className="list-none bg-gray-100 p-4 rounded-lg shadow-lg">
            {leaderboard.today.length > 0 ? (
              leaderboard.today.map((entry, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center py-2 border-b last:border-b-0"
                >
                  <span>
                    {getPositionEmoji(index + 1)} {entry.username}
                  </span>
                  <span>{Math.floor(entry.totalFocusedTime / 60)} mins</span>
                </li>
              ))
            ) : (
              <li>No focus sessions recorded today.</li>
            )}
          </ul>
        </div>

        {/* Last 7 Days Leaderboard */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Last 7 Days</h3>
          <ul className="list-none bg-gray-100 p-4 rounded-lg shadow-lg">
            {leaderboard.last7Days.length > 0 ? (
              leaderboard.last7Days.map((entry, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center py-2 border-b last:border-b-0"
                >
                  <span>
                    {getPositionEmoji(index + 1)} {entry.username}
                  </span>
                  <span>{Math.floor(entry.totalFocusedTime / 60)} mins</span>
                </li>
              ))
            ) : (
              <li>No focus sessions recorded in the last 7 days.</li>
            )}
          </ul>
        </div>

        {/* Weekly Focus Data Chart */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Weekly Progress</h3>
          <Bar
            data={{
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              datasets: [
                {
                  label: "Focused Minutes",
                  data: weeklyFocusData,
                  backgroundColor: "rgba(75, 192, 192, 0.6)",
                  borderColor: "rgba(75, 192, 192, 1)",
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
        
        <div className="mt-8">
  <h3 className="text-xl font-semibold mb-4">Space Medals 🚀</h3>
  <ul className="list-none bg-gradient-to-r from-indigo-900 to-black text-white p-4 rounded-lg shadow-lg">
    {[
      { name: "Asteroid 🪨", threshold: 200 },
      { name: "Comet ☄️", threshold: 300 },
      { name: "Moon 🌙", threshold: 500 },
      { name: "Galaxy 🌌", threshold: 800 },
    ].map((medal, index) => {
      const totalMinutes = Math.round(weeklyFocusData.reduce((a, b) => a + b, 0));
      const progress = Math.min((totalMinutes / medal.threshold) * 100, 100);
      return (
        <li key={index} className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span>{medal.name}</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-4">
            <div
              style={{
                width: `${progress}%`,
                backgroundImage: "linear-gradient(to right, #6a0dad, #8a2be2)",
              }}
              className="h-4 rounded-full shadow-md"
            ></div>
          </div>
          <p className="text-sm text-gray-300 mt-2">
            {totalMinutes} / {medal.threshold} minutes
          </p>
        </li>
      );
    })}
  </ul>
</div>


        
      </div>
    </div>
  
);
}

export default FocusTimerAndLeaderboard;

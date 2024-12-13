import { useState, useEffect } from 'react';
import {
  getDatabase,
  ref,
  onValue,
  push,
  set,
  serverTimestamp,
} from 'firebase/database';
import { auth } from '../config/firebaseConfig';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

function FocusTimerAndLeaderboard() {
  const [time, setTime] = useState(25 * 60); // Default to 25 minutes
  const [isActive, setIsActive] = useState(false);
  const [leaderboard, setLeaderboard] = useState({ today: [], last7Days: [] });
  const [achievements, setAchievements] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [weeklyFocusData, setWeeklyFocusData] = useState([]);

  const user = auth.currentUser;

  // Start or pause the timer
  const toggleTimer = () => setIsActive(!isActive);

  // Save focus session data to Firebase
  const saveFocusSession = async (elapsedTime) => {
    if (!user) {
      alert('You need to log in to save your focus session.');
      return;
    }

    setIsSaving(true);
    const db = getDatabase();
    const focusSessionsRef = ref(db, 'focus_sessions');
    const sessionToSave = {
      userId: user.uid,
      username: user.displayName || 'Anonymous',
      focusedTime: elapsedTime,
      createdAt: serverTimestamp(),
    };

    try {
      const newSessionRef = push(focusSessionsRef);
      await set(newSessionRef, sessionToSave);
      alert('Focus session saved successfully!');
    } catch (error) {
      console.error('Error saving focus session:', error);
      alert('Failed to save focus session. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Fetch leaderboard data and weekly focus data from Firebase
  useEffect(() => {
    const db = getDatabase();
    const focusSessionsRef = ref(db, 'focus_sessions');

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
        const weeklyData = Array(7).fill(0);

        Object.keys(data).forEach((key) => {
          const session = data[key];
          const timestamp = session.createdAt;

          if (timestamp) {
            const sessionDate = new Date(timestamp);
            const dayIndex = (sessionDate.getDay() + 6) % 7; // Convert Sunday (0) to last index (6)

            if (timestamp >= todayStart) {
              if (!todayData[session.userId]) {
                todayData[session.userId] = {
                  username: session.username,
                  totalFocusedTime: 0,
                  pomodoros: 0,
                };
              }
              todayData[session.userId].totalFocusedTime += session.focusedTime;
              todayData[session.userId].pomodoros += Math.floor(session.focusedTime / (25 * 60));
            }

            if (timestamp >= last7DaysStart) {
              if (!last7DaysData[session.userId]) {
                last7DaysData[session.userId] = {
                  username: session.username,
                  totalFocusedTime: 0,
                  pomodoros: 0,
                };
              }
              last7DaysData[session.userId].totalFocusedTime += session.focusedTime;
              last7DaysData[session.userId].pomodoros += Math.floor(session.focusedTime / (25 * 60));

              // Add focused time to the respective day
              weeklyData[dayIndex] += session.focusedTime / 60; // Convert to minutes
            }
          }
        });

        const sortLeaderboard = (data) =>
          Object.values(data).sort(
            (a, b) => b.totalFocusedTime - a.totalFocusedTime
          );

        setLeaderboard({
          today: sortLeaderboard(todayData),
          last7Days: sortLeaderboard(last7DaysData),
        });

        setWeeklyFocusData(weeklyData);

        // Set achievements for the current user
        if (user) {
          const userTodayData = todayData[user.uid] || { totalFocusedTime: 0 };
          const totalMinutes = Math.floor(userTodayData.totalFocusedTime / 60);
          const unlockedAchievements = [];
          if (totalMinutes >= 100) unlockedAchievements.push('🎯 25 minutes');
          if (totalMinutes >= 200) unlockedAchievements.push('🔥 50 minutes');
          if (totalMinutes >= 300) unlockedAchievements.push('🏆 75 minutes');
          if (totalMinutes >= 400) unlockedAchievements.push('🚀 100 minutes');
          if (totalMinutes >= 500) unlockedAchievements.push('🌟 125 minutes');
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

  const getPositionEmoji = (position) => {
    const emojis = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
    return emojis[position - 1] || position;
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Section */}
      <div className="md:col-span-2">
        <h1 className="text-4xl font-bold mb-6 flex items-center">
          🔔 Focus Timer & Leaderboard
        </h1>

        {/* User Greeting */}
        {user && (
          <div className="flex flex-col md:flex-row items-center mb-8">
            <img
              src={user.photoURL}
              alt="User Avatar"
              className="w-16 h-16 rounded-full mr-4 mb-4 md:mb-0"
            />
            <div className="text-center md:text-left">
              <h2 className="text-xl font-semibold">
                Welcome, {user.displayName || 'User'}!
              </h2>
              <p className="text-gray-600">Time to focus and be productive!</p>
            </div>
          </div>
        )}

        {/* Timer Section */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Focus Timer ⏱</h2>
          <div className="text-7xl font-bold mb-4 bg-gray-100 p-4 rounded-lg shadow-lg">
            {`${Math.floor(time / 60)}:${String(time % 60).padStart(2, '0')}`}
          </div>
          <div>
            <button
              onClick={toggleTimer}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg mr-2 shadow-md hover:bg-blue-500"
            >
                            {isActive ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={handlePauseAndSave}
              className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-500"
            >
              Save & Reset
            </button>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Achievements 🎉</h2>
          <ul className="list-disc list-inside bg-gray-100 p-4 rounded-lg shadow-lg">
            {achievements.length > 0 ? (
              achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))
            ) : (
              <li>No achievements unlocked yet. Keep focusing!</li>
            )}
          </ul>
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
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              datasets: [
                {
                  label: 'Focused Minutes',
                  data: weeklyFocusData,
                  backgroundColor: 'rgba(75, 192, 192, 0.6)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              maintainAspectRatio: true,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default FocusTimerAndLeaderboard;



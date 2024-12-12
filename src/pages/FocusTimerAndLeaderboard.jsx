import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, push, set, serverTimestamp } from 'firebase/database';
import { auth } from '../config/firebaseConfig';

function FocusTimerAndLeaderboard() {
  const [time, setTime] = useState(25 * 60); // Default to 25 minutes
  const [isActive, setIsActive] = useState(false);
  const [leaderboard, setLeaderboard] = useState({ today: [], last7Days: [] });
  const [isSaving, setIsSaving] = useState(false);

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

  // Fetch leaderboard data from Firebase
  useEffect(() => {
    const db = getDatabase();
    const focusSessionsRef = ref(db, 'focus_sessions');

    onValue(focusSessionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const last7DaysStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6).getTime();

        const todayData = {};
        const last7DaysData = {};

        Object.keys(data).forEach((key) => {
          const session = data[key];
          const timestamp = session.createdAt;

          if (timestamp && timestamp >= todayStart) {
            if (!todayData[session.userId]) {
              todayData[session.userId] = { username: session.username, totalFocusedTime: 0 };
            }
            todayData[session.userId].totalFocusedTime += session.focusedTime;
          }

          if (timestamp && timestamp >= last7DaysStart) {
            if (!last7DaysData[session.userId]) {
              last7DaysData[session.userId] = { username: session.username, totalFocusedTime: 0 };
            }
            last7DaysData[session.userId].totalFocusedTime += session.focusedTime;
          }
        });

        const sortLeaderboard = (data) =>
          Object.values(data).sort((a, b) => b.totalFocusedTime - a.totalFocusedTime);

        setLeaderboard({
          today: sortLeaderboard(todayData),
          last7Days: sortLeaderboard(last7DaysData),
        });
      } else {
        setLeaderboard({ today: [], last7Days: [] });
      }
    });
  }, []);

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

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Focus Timer & Leaderboard</h1>

      {/* User Greeting */}
      {user && (
        <div className="flex items-center mb-8">
          <img
            src={user.photoURL}
            alt="User Avatar"
            className="w-16 h-16 rounded-full mr-4"
          />
          <div>
            <h2 className="text-xl font-semibold">Welcome, {user.displayName || 'User'}!</h2>
            <p className="text-gray-600">Time to focus and be productive!</p>
          </div>
        </div>
      )}

      {/* Timer Section */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Focus Timer</h2>
        <div className="text-5xl font-bold mb-4">
          {`${Math.floor(time / 60)}:${String(time % 60).padStart(2, '0')}`}
        </div>
        <div>
          <button
            onClick={toggleTimer}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg mr-2"
          >
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={handlePauseAndSave}
            className="bg-green-600 text-white px-6 py-2 rounded-lg mr-2"
          >
            Save and Reset
          </button>
          <button
            onClick={() => {
              setTime(25 * 60);
              setIsActive(false);
            }}
            className="bg-gray-400 text-white px-6 py-2 rounded-lg"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Leaderboard */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Leaderboard</h2>
        <div className="mb-6">
          <h3 className="text-xl font-semibold">Today</h3>
          {leaderboard.today.length === 0 ? (
            <p className="text-gray-500">No focus sessions recorded today.</p>
          ) : (
            <ul>
              {leaderboard.today.map((entry, index) => (
                <li key={index} className="mb-2">
                  <span className="font-semibold">{entry.username}</span>:{' '}
                  {Math.floor(entry.totalFocusedTime / 60)} minutes
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold">Last 7 Days</h3>
          {leaderboard.last7Days.length === 0 ? (
            <p className="text-gray-500">No focus sessions recorded in the last 7 days.</p>
          ) : (
            <ul>
              {leaderboard.last7Days.map((entry, index) => (
                <li key={index} className="mb-2">
                  <span className="font-semibold">{entry.username}</span>:{' '}
                  {Math.floor(entry.totalFocusedTime / 60)} minutes
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default FocusTimerAndLeaderboard;

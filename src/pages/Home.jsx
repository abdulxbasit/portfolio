import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { Book, List, Cloud, Calculator, Image, ShoppingCart, Music, Gamepad, Video, Code, Dices, Clock } from 'lucide-react';

function Home() {
  const [user, setUser] = useState(null);
  const provider = new GoogleAuthProvider();

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Handle login
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  const miniProjects = [
    { name: 'Book Readers Club', path: '/books', icon: <Book /> },
    { name: 'Todo App', path: '/todo', icon: <List /> },
    { name: 'Weather App', path: '/weather', icon: <Cloud /> },
    { name: 'Focus Timer & Leaderboard', path: '/focus-timer', icon: <Clock /> },
    { name: 'Image Gallery', path: '/image-gallery', icon: <Image /> },
    { name: 'E-Commerce App', path: '/ecommerce', icon: <ShoppingCart /> },
    { name: 'Random Stuff', path: '/random-stuff', icon: <Dices /> },
    { name: 'Game Hub', path: '/game-hub', icon: <Gamepad /> },
    { name: 'Video Streaming', path: '/video-streaming', icon: <Video /> },
    { name: 'Code Editor', path: '/code-editor', icon: <Code /> },
    
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Welcome to My Mini Projects</h1>
        <div>
          {user ? (
            <div className="flex items-center space-x-4">
              <img
                src={user.photoURL}
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-sm font-medium">{user.displayName}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Sign In with Google
            </button>
          )}
        </div>
      </div>
      <p className="text-center text-gray-400 mb-6">Select a project to explore:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
        {miniProjects.map((project, index) => (
          <Link
            key={index}
            to={project.path}
            className="bg-gray-800 hover:bg-gray-700 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 flex flex-col items-center"
          >
            <div className="text-4xl mb-4">{project.icon}</div>
            <h3 className="text-lg font-semibold">{project.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;




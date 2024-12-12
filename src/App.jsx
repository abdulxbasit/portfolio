import { useEffect } from 'react';
import { Routes, Route } from 'react-router';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Booklist from './pages/Booklist';
import TailwindClassShowcase from './pages/TailwindShowcase';
import Portfolio from './pages/portfolio';
import RandomStuff from './pages/RandomStuff';
import WeatherInfo from './pages/WeatherInfo';
import { auth } from './config/firebaseConfig'; // Ensure this is correct
import { onAuthStateChanged } from 'firebase/auth';
import FocusTimerAndLeaderboard from './pages/FocusTimerAndLeaderboard';
function App() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User logged in: ', user);
      } else {
        console.log('User logged out');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Booklist />} />
        <Route path="/tailwind-showcase" element={<TailwindClassShowcase />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/random-stuff" element={<RandomStuff />} />
        <Route path="/weather" element={<WeatherInfo />} />
        <Route path="/focus-timer" element={<FocusTimerAndLeaderboard />} />
        
        <Route
          path="*"
          element={
            <div className="text-center mt-10">
              <h1 className="text-3xl font-bold">404</h1>
              <p className="text-gray-500">Page not found</p>
              <div className="flex justify-center items-center mt-4"></div>
                <p className="text-xl font-semibold ml-2">This page is under development. Stay tuned! 🚧👷‍♂️</p>
              </div>
            
          }
        />
      </Routes>
    </div>
  );
}

export default App;

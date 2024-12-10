
import { Routes, Route } from 'react-router';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Booklist from './pages/Booklist';
import TailwindClassShowcase from './pages/TailwindShowcase';
import Portfolio from './pages/portfolio';
import RandomStuff from './pages/RandomStuff';
import WeatherInfo from './pages/WeatherInfo';

function App() {
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
      </Routes>
    </div>
  );
}

export default App;
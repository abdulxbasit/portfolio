import { useState, useEffect } from 'react';
import { 
  Cat, 
  Smile, 
  Wand2, 
  RefreshCw, 
  Quote, 
  Clock,
  Globe
} from 'lucide-react';

const RandomStuff = () => {
  // State for each component
  const [catImage, setCatImage] = useState("");
  const [emoji, setEmoji] = useState(null);
  const [randomQuote, setRandomQuote] = useState(null);
  const [planet, setPlanet] = useState(null);

  // Loading and error states
  const [loading, setLoading] = useState({
    cat: true,
    emoji: true,
    quote: true,
    planet: true,
  });
  const [error, setError] = useState({
    cat: null,
    emoji: null,
    quote: null,
    planet: null,
  });

  const [autoRefresh, setAutoRefresh] = useState(false);
  const [currentPlanetIndex, setCurrentPlanetIndex] = useState(0);

  const planets = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];

  useEffect(() => {
    // Initial fetch of all data
    fetchAllData();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchAllData();
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);
  
  // Fetch all data at once
  const fetchAllData = () => {
    fetchCatImage();
    fetchRandomEmoji();
    fetchRandomQuote();
    fetchRandomPlanet();
  };

  const fetchCatImage = async () => {
    setLoading(prev => ({ ...prev, cat: true }));
    try {
      const response = await fetch("https://api.thecatapi.com/v1/images/search");
      const data = await response.json();
      setCatImage(data[0].url);
      setError(prev => ({ ...prev, cat: null }));
    } catch (err) {
      setError(prev => ({ ...prev, cat: "Failed to load cat image" }));
    } finally {
      setLoading(prev => ({ ...prev, cat: false }));
    }
  };

  const fetchRandomEmoji = async () => {
    setLoading(prev => ({ ...prev, emoji: true }));
    try {
      const response = await fetch('https://emojihub.yurace.pro/api/random');
      const data = await response.json();
      setEmoji(data);
      setError(prev => ({ ...prev, emoji: null }));
    } catch (err) {
      setError(prev => ({ ...prev, emoji: "Failed to load emoji" }));
    } finally {
      setLoading(prev => ({ ...prev, emoji: false }));
    }
  };

  const fetchRandomQuote = async () => {
    setLoading(prev => ({ ...prev, quote: true }));
    try {
      const response = await fetch("https://api.api-ninjas.com/v1/quotes", {
        method: 'GET',
        headers: { 
          'X-Api-Key': 'dGnwz6JNEF9CAa/3yA960w==J2BKSFhi9w4sM58w',
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setRandomQuote(data[0]);
      setError(prev => ({ ...prev, quote: null }));
    } catch (err) {
      setError(prev => ({ ...prev, quote: "Failed to load quote" }));
    } finally {
      setLoading(prev => ({ ...prev, quote: false }));
    }
  };

  const fetchRandomPlanet = async () => {
    setLoading(prev => ({ ...prev, planet: true }));
    try {
      // Use the current planet in the cycle
      const currentPlanet = planets[currentPlanetIndex];

      const response = await fetch(`https://api.api-ninjas.com/v1/planets?name=${currentPlanet}`, {
        method: 'GET',
        headers: { 
          'X-Api-Key': 'dGnwz6JNEF9CAa/3yA960w==J2BKSFhi9w4sM58w',
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setPlanet(data[0]);
      setError(prev => ({ ...prev, planet: null }));

      // Increment planet index, wrapping around to 0 if it reaches the end
      setCurrentPlanetIndex((prevIndex) => (prevIndex + 1) % planets.length);
    } catch (err) {
      setError(prev => ({ ...prev, planet: "Failed to load planet info" }));
    } finally {
      setLoading(prev => ({ ...prev, planet: false }));
    }
  };

  // Render image or loading/error state
  const renderContent = (content, loading, error, isImage = false, altText = "") => (
    <div className="relative bg-gray-100 rounded-lg overflow-hidden h-64 flex items-center justify-center">
      {loading ? (
        <div className="animate-pulse text-gray-400">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : isImage ? (
        <img 
          src={content} 
          alt={altText} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="text-center text-gray-600">{content}</div>
      )}
    </div>
  );

  // Planet emoji renderer
  const renderPlanetEmoji = (planetName) => {
    const planetEmojis = {
      'Mercury': '🌑',
      'Venus': '🌕',
      'Earth': '🌍',
      'Mars': '🔴',
      'Jupiter': '🌎',
      'Saturn': '🪐',
      'Uranus': '🔵',
      'Neptune': '💙'
    };
    return planetEmojis[planetName] || '🌠';
  };

  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
        <Wand2 className="mr-4" /> Random Stuff Hub
      </h1>

      <div className="flex justify-center space-x-4 mb-6">
        <button 
          onClick={() => setAutoRefresh(!autoRefresh)}
          className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition flex items-center">
          {autoRefresh ? (
            <>
              <RefreshCw className="mr-2" /> Stop Auto Refresh
            </>
          ) : (
            <>
              <Clock className="mr-2" /> Start Auto Refresh
            </>
          )}
        </button>
        <button 
          onClick={fetchAllData}
          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition flex items-center">
          <RefreshCw className="mr-2" /> Refresh All
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Cat Image Section */}
        <div className="bg-white shadow-lg rounded-xl p-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Cat className="mr-2 text-purple-600" /> Random Cat
          </h2>
          {renderContent(catImage, loading.cat, error.cat, true, "Random Cat")}
          <button 
            onClick={fetchCatImage}
            disabled={loading.cat}
            className="mt-4 w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition disabled:opacity-50"
          >
            <RefreshCw className="inline-block mr-2" /> Fetch New Cat
          </button>
        </div>

        {/* Emoji Section */}
        <div className="bg-white shadow-lg rounded-xl p-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Smile className="mr-2 text-yellow-600" /> Random Emoji
          </h2>
          <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
            {loading.emoji ? (
              <div className="animate-pulse text-gray-400">Loading...</div>
            ) : error.emoji ? (
              <div className="text-red-500">{error.emoji}</div>
            ) : emoji ? (
              <div className="text-center">
                <span 
                  className="text-8xl" 
                  dangerouslySetInnerHTML={{ __html: `&#${emoji.htmlCode[0].slice(2, -1)};` }}
                />
                <p className="mt-4 text-gray-600">{emoji.name}</p>
              </div>
            ) : null}
          </div>
          <button 
            onClick={fetchRandomEmoji}
            disabled={loading.emoji}
            className="mt-4 w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition flex items-center justify-center disabled:opacity-50"
          >
            <RefreshCw className="mr-2" /> Get New Emoji
          </button>
        </div>

        {/* Quote Section */}
        <div className="bg-white shadow-lg rounded-xl p-4">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Quote className="mr-2 text-teal-600" /> Random Quote 💡📖
          </h2>
          <div className="text-lg">
            {loading.quote ? (
              <div className="animate-pulse text-gray-400">Loading...</div>
            ) : error.quote ? (
              <div className="text-red-500">{error.quote}</div>
            ) : randomQuote ? (
              <div className="text-center">
                <p className="italic text-gray-700 mb-2">"{randomQuote.quote}"</p>
                <p className="font-semibold text-gray-600">- {randomQuote.author}</p>
              </div>
            ) : null}
          </div>
          <button 
            onClick={fetchRandomQuote}
            disabled={loading.quote}
            className="mt-4 w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition disabled:opacity-50"
          >
            <RefreshCw className="inline-block mr-2" /> New Quote 🔍
          </button>
        </div>

        {/* Planet Section */}
        <div className="bg-white shadow-lg rounded-xl p-4">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Globe className="mr-2 text-indigo-600" /> Cosmic Planet 🌍🚀
          </h2>
          <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
            {loading.planet ? (
              <div className="animate-pulse text-gray-400">Loading...</div>
            ) : error.planet ? (
              <div className="text-red-500">{error.planet}</div>
            ) : planet ? (
              <div className="text-center p-4">
                <p className="text-3xl mb-2">
                  {renderPlanetEmoji(planet.name)} {planet.name}
                </p>
                <div className="text-gray-700 text-left space-y-2">
                  <p>
                    <strong>Mass:</strong> {(planet.mass).toFixed(5)} Jupiter masses 🌎
                    <span className="text-xs block">
                      ({(planet.mass * 1.898e27).toExponential(2)} kg)
                    </span>
                  </p>
                  <p>
                    <strong>Radius:</strong> {(planet.radius).toFixed(3)} Jupiter radii 🌐
                    <span className="text-xs block">
                      ({(planet.radius * 69911).toFixed(0)} km)
                    </span>
                  </p>
                  <p><strong>Orbital Period:</strong> {planet.period} Earth days 🕰️</p>
                  <p><strong>Semi-Major Axis:</strong> {planet.semi_major_axis} AU 📐</p>
                  <p><strong>Surface Temperature:</strong> {planet.temperature} K 🌡️</p>
                  <p><strong>Distance:</strong> {planet.distance_light_year.toFixed(6)} light-years 🌟</p>
                </div>
              </div>
            ) : null}
          </div>
          <button 
            onClick={fetchRandomPlanet}
            disabled={loading.planet}
            className="mt-4 w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition disabled:opacity-50"
          >
            <RefreshCw className="inline-block mr-2" /> Next Planet 🌠
          </button>
        </div>
      </div>
    </div>
  );
};

export default RandomStuff;
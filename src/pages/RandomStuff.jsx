import { useState, useEffect } from 'react';
import { 
  Dog, 
  Cat, 
  Smile, 
  Wand2, 
  RefreshCw, 
  Info, 
  Code, 
  Star, 
  Film, 
  Clock
} from 'lucide-react';

// Anime tags array
const animeTags = [
  "cuddle", "hug", "pat", "smug", "bonk", 
  "blush", "smile", "wave", "highfive", "nom", "bite", 
  "happy", "wink", "poke", "dance", "cringe"
];

const RandomStuff = () => {
  // State for each component
  const [dogImage, setDogImage] = useState("");
  const [catImage, setCatImage] = useState("");
  const [animeImage, setAnimeImage] = useState("");
  const [emoji, setEmoji] = useState(null);
  const [programmingJoke, setProgrammingJoke] = useState("");
  const [randomFact, setRandomFact] = useState("");
  const [randomGif, setRandomGif] = useState("");
  const [currentAnimeTag, setCurrentAnimeTag] = useState("");
  const [currentAnimeTagIndex, setCurrentAnimeTagIndex] = useState(0);

  // Loading and error states
  const [loading, setLoading] = useState({
    dog: true,
    cat: true,
    anime: true,
    emoji: true,
    joke: true,
    fact: true,
    gif: true,
  });
  const [error, setError] = useState({
    dog: null,
    cat: null,
    anime: null,
    emoji: null,
    joke: null,
    fact: null,
    gif: null,
  });

  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    // Initial fetch of all data
    fetchAllData();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchAllData();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);
  
  // Fetch all data at once
  const fetchAllData = () => {
    fetchDogImage();
    fetchCatImage();
    fetchAnimeImage();
    fetchRandomEmoji();
    fetchProgrammingJoke();
    fetchRandomFact();
    fetchRandomGif();
  };

  const getNextAnimeTag = () => {
    const nextIndex = (currentAnimeTagIndex + 1) % animeTags.length;
    setCurrentAnimeTagIndex(nextIndex);
    const nextTag = animeTags[nextIndex];
    setCurrentAnimeTag(nextTag);
    return nextTag;
  };

  // Fetch functions for each API
  const fetchDogImage = async () => {
    setLoading(prev => ({ ...prev, dog: true }));
    try {
      const response = await fetch("https://dog.ceo/api/breeds/image/random");
      const data = await response.json();
      setDogImage(data.message);
      setError(prev => ({ ...prev, dog: null }));
    } catch (err) {
      setError(prev => ({ ...prev, dog: "Failed to load dog image" }));
    } finally {
      setLoading(prev => ({ ...prev, dog: false }));
    }
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

  const fetchAnimeImage = async () => {
    const tag = getNextAnimeTag(); // Get and set next tag
    setLoading(prev => ({ ...prev, anime: true }));
    try {
      const response = await fetch(`https://api.waifu.pics/sfw/${tag}`);
      const data = await response.json();
      setAnimeImage(data.url);
      setError(prev => ({ ...prev, anime: null }));
    } catch (err) {
      setError(prev => ({ ...prev, anime: `Failed to load ${tag} anime image` }));
    } finally {
      setLoading(prev => ({ ...prev, anime: false }));
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

  const fetchProgrammingJoke = async () => {
    setLoading(prev => ({ ...prev, joke: true }));
    try {
      const response = await fetch("https://v2.jokeapi.dev/joke/Programming?type=single");
      const data = await response.json();
      setProgrammingJoke(data.joke);
      setError(prev => ({ ...prev, joke: null }));
    } catch (err) {
      setError(prev => ({ ...prev, joke: "Failed to load programming joke" }));
    } finally {
      setLoading(prev => ({ ...prev, joke: false }));
    }
  };

  const fetchRandomFact = async () => {
    setLoading(prev => ({ ...prev, fact: true }));
    try {
      const response = await fetch("https://uselessfacts.jsph.pl/random.json?language=en");
      const data = await response.json();
      setRandomFact(data.text);
      setError(prev => ({ ...prev, fact: null }));
    } catch (err) {
      setError(prev => ({ ...prev, fact: "Failed to load random fact" }));
    } finally {
      setLoading(prev => ({ ...prev, fact: false }));
    }
  };

  const fetchRandomGif = async () => {
    setLoading(prev => ({ ...prev, gif: true }));
    try {
      // Note: Replace 'YOUR_API_KEY' with an actual Giphy API key
      const response = await fetch("https://api.giphy.com/v1/gifs/random?api_key=X1pPqm7592bOemjON3RMHvvIoerWWOig");
      const data = await response.json();
      setRandomGif(data.data.images.original.url);
      setError(prev => ({ ...prev, gif: null }));
    } catch (err) {
      setError(prev => ({ ...prev, gif: "Failed to load random gif" }));
    } finally {
      setLoading(prev => ({ ...prev, gif: false }));
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

        {/* Anime Image Section */}
        <div className="bg-white shadow-lg rounded-xl p-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Film className="mr-2 text-pink-600" /> Random Anime ({currentAnimeTag})
          </h2>
          {renderContent(animeImage, loading.anime, error.anime, true, `Random Anime (${currentAnimeTag})`)}
          <button 
            onClick={fetchAnimeImage}
            disabled={loading.anime}
            className="mt-4 w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition disabled:opacity-50"
          >
            <RefreshCw className="inline-block mr-2" /> Fetch New Anime
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
        {/* Dog Image Section */}
        <div className="bg-white shadow-lg rounded-xl p-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Dog className="mr-2 text-blue-600" /> Random Dog
          </h2>
          {renderContent(dogImage, loading.dog, error.dog, true, "Random Dog")}
          <button 
            onClick={fetchDogImage}
            disabled={loading.dog}
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            <RefreshCw className="inline-block mr-2" /> Fetch New Dog
          </button>
        </div>

        {/* Programming Joke Section */}
        <div className="bg-white shadow-lg rounded-xl p-4">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Code className="mr-2 text-green-600" /> Programming Joke 💻🤣
          </h2>
          <div className="text-lg">
            {renderContent(
              programmingJoke ? `🖥️ ${programmingJoke}` : "", 
              loading.joke, 
              error.joke
            )}
          </div>
          <button 
            onClick={fetchProgrammingJoke}
            disabled={loading.joke}
            className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
          >
            <RefreshCw className="inline-block mr-2" /> New Joke 😂
          </button>
        </div>

        {/* Random Fact Section */}
        <div className="bg-white shadow-lg rounded-xl p-4">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Info className="mr-2 text-teal-600" /> Random Fact 🤓🌟
          </h2>
          <div className="text-lg">
            {renderContent(
              randomFact ? `🧠 ${randomFact}` : "", 
              loading.fact, 
              error.fact
            )}
          </div>
          <button 
            onClick={fetchRandomFact}
            disabled={loading.fact}
            className="mt-4 w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition disabled:opacity-50"
          >
            <RefreshCw className="inline-block mr-2" /> New Fact 🔍
          </button>
        </div>


        {/* Random GIF Section */}
        <div className="bg-white shadow-lg rounded-xl p-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Star className="mr-2 text-indigo-600" /> Random GIF
          </h2>
          {renderContent(randomGif, loading.gif, error.gif, true, "Random GIF")}
          <button 
            onClick={fetchRandomGif}
            disabled={loading.gif}
            className="mt-4 w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition disabled:opacity-50"
          >
            <RefreshCw className="inline-block mr-2" /> Fetch New GIF
          </button>
        </div>
      </div>
    </div>
  );
};

export default RandomStuff;
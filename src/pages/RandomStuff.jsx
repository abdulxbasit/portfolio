import React, { useState, useEffect } from 'react';
import { 
  Dog, 
  Cat, 
  Smile, 
  Wand2, 
  RefreshCw, 
  Info 
} from 'lucide-react';

const RandomStuff = () => {
  // State for each component
  const [dogImage, setDogImage] = useState("");
  const [catImage, setCatImage] = useState("");
  const [animeImage, setAnimeImage] = useState("");
  const [emoji, setEmoji] = useState(null);

  // Loading and error states
  const [loading, setLoading] = useState({
    dog: true,
    cat: true,
    anime: true,
    emoji: true
  });
  const [error, setError] = useState({
    dog: null,
    cat: null,
    anime: null,
    emoji: null
  });

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
    setLoading(prev => ({ ...prev, anime: true }));
    try {
      const response = await fetch("https://api.waifu.pics/sfw/bite");
      if (!response.ok) {
        throw new Error("Failed to fetch anime image");
      }
      const data = await response.json();
      setAnimeImage(data.url);
      setError(prev => ({ ...prev, anime: null }));
    } catch (err) {
      setError(prev => ({ ...prev, anime: "Failed to load anime image" }));
    } finally {
      setLoading(prev => ({ ...prev, anime: false }));
    }
  };

  const fetchRandomEmoji = async () => {
    setLoading(prev => ({ ...prev, emoji: true }));
    try {
      const response = await fetch('https://emojihub.yurace.pro/api/random');
      if (!response.ok) {
        throw new Error('Failed to fetch emoji');
      }
      const data = await response.json();
      setEmoji(data);
      setError(prev => ({ ...prev, emoji: null }));
    } catch (err) {
      setError(prev => ({ ...prev, emoji: "Failed to load emoji" }));
    } finally {
      setLoading(prev => ({ ...prev, emoji: false }));
    }
  };

  // Fetch initial data on component mount
  useEffect(() => {
    fetchDogImage();
    fetchCatImage();
    fetchAnimeImage();
    fetchRandomEmoji();
  }, []);

  // Render image or loading/error state
  const renderImage = (image, loading, error, altText) => (
    <div className="relative bg-gray-100 rounded-lg overflow-hidden h-64 flex items-center justify-center">
      {loading ? (
        <div className="animate-pulse text-gray-400">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <img 
          src={image} 
          alt={altText} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
        <Wand2 className="mr-4" /> Random Stuff Hub
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Dog Image Section */}
        <div className="bg-white shadow-lg rounded-xl p-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Dog className="mr-2 text-blue-600" /> Random Dog
          </h2>
          {renderImage(dogImage, loading.dog, error.dog, "Random Dog")}
          <button 
            onClick={fetchDogImage}
            disabled={loading.dog}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center disabled:opacity-50"
          >
            <RefreshCw className="mr-2" /> Fetch New Dog
          </button>
        </div>

        {/* Cat Image Section */}
        <div className="bg-white shadow-lg rounded-xl p-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Cat className="mr-2 text-green-600" /> Random Cat
          </h2>
          {renderImage(catImage, loading.cat, error.cat, "Random Cat")}
          <button 
            onClick={fetchCatImage}
            disabled={loading.cat}
            className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center disabled:opacity-50"
          >
            <RefreshCw className="mr-2" /> Fetch New Cat
          </button>
        </div>

        {/* Anime Image Section */}
        <div className="bg-white shadow-lg rounded-xl p-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Info className="mr-2 text-pink-600" /> Random Anime
          </h2>
          {renderImage(animeImage, loading.anime, error.anime, "Random Anime")}
          <button 
            onClick={fetchAnimeImage}
            disabled={loading.anime}
            className="mt-4 w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition flex items-center justify-center disabled:opacity-50"
          >
            <RefreshCw className="mr-2" /> Fetch New Anime
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
      </div>
    </div>
  );
};

export default RandomStuff;
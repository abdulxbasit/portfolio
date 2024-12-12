import { useState, useEffect } from "react";
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  CloudFog, 
  Droplet, 
  Wind, 
  Thermometer, 
  Search 
} from 'lucide-react';

const WeatherInfo = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("RahimYar Khan");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiKey = "d58b64432b0ed37afb2503767779134e";

  // Map weather conditions to icons, emojis, and background colors
  const weatherIcons = {
    'Clear': { icon: <Sun className="w-16 h-16 text-yellow-500" />, emoji: "☀️", bg: 'bg-gradient-to-r from-yellow-200 to-orange-300' },
    'Clouds': { icon: <Cloud className="w-16 h-16 text-gray-500" />, emoji: "☁️", bg: 'bg-gradient-to-r from-gray-200 to-blue-200' },
    'Rain': { icon: <CloudRain className="w-16 h-16 text-blue-600" />, emoji: "🌧️", bg: 'bg-gradient-to-r from-blue-300 to-indigo-400' },
    'Snow': { icon: <CloudSnow className="w-16 h-16 text-white" />, emoji: "❄️", bg: 'bg-gradient-to-r from-blue-100 to-white' },
    'Mist': { icon: <CloudFog className="w-16 h-16 text-gray-400" />, emoji: "🌫️", bg: 'bg-gradient-to-r from-gray-200 to-blue-100' },
    'default': { icon: <Cloud className="w-16 h-16 text-gray-500" />, emoji: "☁️", bg: 'bg-gradient-to-r from-gray-200 to-blue-200' }
  };

  const getWeather = async (cityName) => {
    if (!cityName) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error('City not found. Please check the city name.');
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch default city weather on component mount
  useEffect(() => {
    getWeather(city);
  }, []);

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      getWeather(city);
    }
  };

  // Get weather icon and background
  const getWeatherStyle = (condition) => {
    return weatherIcons[condition] || weatherIcons['default'];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Section */}
        <div className="p-6 bg-white shadow-md rounded-lg flex flex-col items-center">
          <h1 className="text-2xl font-bold text-blue-600 mb-4">Weather Finder</h1>
          <div className="relative w-full">
            <input 
              type="text" 
              value={city} 
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter city name" 
              className="w-full pl-10 pr-4 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-lg"
            />
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" 
            />
            <button 
              onClick={() => getWeather(city)} 
              disabled={loading}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? '...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Weather Display */}
        {error && (
          <div className="p-4 bg-red-100 text-red-700 text-center">
            {error}
          </div>
        )}

        {weather && (
          <div className={`p-6 text-center ${getWeatherStyle(weather.weather[0].main).bg}`}>
            <div className="flex justify-center items-center mb-4">
              {getWeatherStyle(weather.weather[0].main).icon}
              <span className="text-4xl ml-2">{getWeatherStyle(weather.weather[0].main).emoji}</span>
            </div>
            
            <h2 className="text-3xl font-bold mb-2">
              {weather.name}, {weather.sys.country}
            </h2>
            <p className="text-xl mb-4 capitalize">
              {weather.weather[0].description}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex flex-col items-center">
                <Thermometer className="w-8 h-8 text-white mb-2" />
                <p className="font-semibold">{weather.main.temp.toFixed(1)}°C</p>
                <p className="text-sm">Temperature</p>
              </div>
              <div className="flex flex-col items-center">
                <Droplet className="w-8 h-8 text-white mb-2" />
                <p className="font-semibold">{weather.main.humidity}%</p>
                <p className="text-sm">Humidity</p>
              </div>
              <div className="flex flex-col items-center">
                <Wind className="w-8 h-8 text-white mb-2" />
                <p className="font-semibold">{weather.wind.speed} m/s</p>
                <p className="text-sm">Wind Speed</p>
              </div>
              <div className="flex flex-col items-center">
                <CloudRain className="w-8 h-8 text-white mb-2" />
                <p className="font-semibold">{weather.clouds.all}%</p>
                <p className="text-sm">Cloudiness</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherInfo;
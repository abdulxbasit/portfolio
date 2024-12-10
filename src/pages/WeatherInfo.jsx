import React, { useState } from "react";
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
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiKey = "d58b64432b0ed37afb2503767779134e";

  // Map weather conditions to icons and background colors
  const weatherIcons = {
    'Clear': { icon: <Sun className="w-16 h-16 text-yellow-500" />, bg: 'bg-gradient-to-r from-yellow-200 to-orange-300' },
    'Clouds': { icon: <Cloud className="w-16 h-16 text-gray-500" />, bg: 'bg-gradient-to-r from-gray-200 to-blue-200' },
    'Rain': { icon: <CloudRain className="w-16 h-16 text-blue-600" />, bg: 'bg-gradient-to-r from-blue-300 to-indigo-400' },
    'Snow': { icon: <CloudSnow className="w-16 h-16 text-white" />, bg: 'bg-gradient-to-r from-blue-100 to-white' },
    'Mist': { icon: <CloudFog className="w-16 h-16 text-gray-400" />, bg: 'bg-gradient-to-r from-gray-200 to-blue-100' },
    'default': { icon: <Cloud className="w-16 h-16 text-gray-500" />, bg: 'bg-gradient-to-r from-gray-200 to-blue-200' }
  };

  const getWeather = async () => {
    if (!city) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
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

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      getWeather();
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
        <div className="p-6 bg-blue-600 text-white">
          <div className="relative">
            <input 
              type="text" 
              value={city} 
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter city name" 
              className="w-full pl-10 pr-4 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" 
            />
            <button 
              onClick={getWeather} 
              disabled={loading}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-blue-50 transition disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
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
            <div className="flex justify-center mb-4">
              {getWeatherStyle(weather.weather[0].main).icon}
            </div>
            
            <h2 className="text-3xl font-bold mb-2">
              {weather.name}, {weather.sys.country}
            </h2>
            <p className="text-xl mb-4 capitalize">
              {weather.weather[0].description}
            </p>

            <div className="grid grid-cols-3 gap-4 mt-6">
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherInfo;
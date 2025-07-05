import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Shirt, ShoppingBag, Sparkles } from 'lucide-react';
import { OutfitSuggestion, WeatherData } from '../types';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Suggestions: React.FC = () => {
  const [wardrobeSuggestions, setWardrobeSuggestions] = useState<OutfitSuggestion[]>([]);
  const [weatherSuggestions, setWeatherSuggestions] = useState<OutfitSuggestion[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  const [mood, setMood] = useState('date night');
  const [location, setLocation] = useState('Delhi');

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');

  useEffect(() => {
    fetchMoodAndWeatherSuggestions();
  }, []);

  const fetchMoodAndWeatherSuggestions = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem('token');

    // Mood suggestion
    const moodRes = await api.post('/suggestions', {
      mood,
      location
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Weather suggestion
    const weatherRes = await api.post('/suggestions/weather', {
      mood,
      location
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setWeatherData(weatherRes.data.weather);

    const suggestions = [
      {
        id: 'mood-suggestion',
        occasion: `${moodRes.data.mood} Vibes`,
        confidence: 0.9,
        items: moodRes.data.outfit,
        buyLinks: []
      },
      {
        id: 'weather-suggestion',
        occasion: `Weather: ${weatherRes.data.weather.condition} - ${weatherRes.data.weather.temperature}°C`,
        confidence: 0.85,
        items: weatherRes.data.outfit,
        buyLinks: []
      }
    ];

    setWardrobeSuggestions(suggestions);
  } catch (err) {
    console.error('Could not fetch suggestions:', err);
  } finally {
    setLoading(false);
  }
};


  const handleUpload = async () => {
    if (!uploadFile) return alert('Choose a file first!');
    const formData = new FormData();
    formData.append('image', uploadFile);
    formData.append('caption', caption);

    try {
      await api.post('/wardrobe/upload', formData);
      alert('Uploaded! Refreshing suggestions...');
      fetchMoodAndWeatherSuggestions();
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed');
    }
  };

  const SuggestionCard: React.FC<{ suggestion: OutfitSuggestion }> = ({ suggestion }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">{suggestion.occasion}</h3>
          <div className="flex items-center space-x-1">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round(suggestion.confidence * 100)}% match
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {suggestion.items.map((item) => (
            <div key={item.id} className="relative">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-24 object-cover rounded-lg"
              />
              <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {item.category}
              </div>
            </div>
          ))}
        </div>

        {suggestion.buyLinks && suggestion.buyLinks.length > 0 && (
          <div className="border-t border-gray-200 dark:border-dark-600 pt-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Missing items? Shop similar:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestion.buyLinks.slice(0, 2).map((link, index) => (
                <motion.a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-2 bg-gray-100 dark:bg-dark-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{link.name}</span>
                  <span className="text-primary-600 dark:text-primary-400 font-medium">
                    {link.price}
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 pt-20 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 pt-20 pb-20 md:pb-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mood + Location Inputs */}
        <div className="bg-white dark:bg-dark-800 p-4 rounded-2xl mb-8 flex flex-col gap-4 sm:flex-row items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 items-center w-full">
            <input
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="Mood (e.g. beach party, gym, wedding)"
              className="p-2 rounded-lg w-full border border-gray-300 dark:border-gray-700 dark:bg-dark-700"
            />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location (e.g. Mumbai, Goa)"
              className="p-2 rounded-lg w-full border border-gray-300 dark:border-gray-700 dark:bg-dark-700"
            />
          </div>
          <button
            onClick={fetchMoodAndWeatherSuggestions}
            className="mt-3 sm:mt-0 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition"
          >
            Get Suggestions
          </button>
        </div>

        {/* Upload Clothing Item */}
        <div className="bg-white dark:bg-dark-800 p-4 rounded-2xl mb-8">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Upload Wardrobe Item</h3>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              className="text-sm"
            />
            <input
              type="text"
              placeholder="Caption (e.g. shimmery black dress)"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-dark-700"
            />
            <button
              onClick={handleUpload}
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
            >
              Upload
            </button>
          </div>
        </div>

        {/* Suggestions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mood-Based Suggestions */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Shirt className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">From Your Wardrobe</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Based on your uploaded clothing items</p>
              </div>
            </div>
            <div className="space-y-6">
              {wardrobeSuggestions.map((suggestion) => (
                <SuggestionCard key={suggestion.id} suggestion={suggestion} />
              ))}
              {wardrobeSuggestions.length === 0 && (
                <div className="text-center py-8 bg-white dark:bg-dark-800 rounded-2xl">
                  <Shirt className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No wardrobe items yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Upload your clothing items to get personalized suggestions
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Weather-Based Suggestions */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center">
                <Cloud className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Weather-Based</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Perfect outfits for today’s weather</p>
              </div>
            </div>

            {weatherData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-4 mb-6 text-white"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{weatherData.location}</h3>
                    <p className="text-blue-100">{weatherData.condition}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{weatherData.temperature}°</div>
                    <div className="text-blue-100 text-sm">{weatherData.humidity}% humidity</div>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="space-y-6">
              {weatherSuggestions.map((suggestion) => (
                <SuggestionCard key={suggestion.id} suggestion={suggestion} />
              ))}
              {weatherSuggestions.length === 0 && (
                <div className="text-center py-8 bg-white dark:bg-dark-800 rounded-2xl">
                  <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No weather suggestions
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try changing mood or location to get tailored outfits
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suggestions;

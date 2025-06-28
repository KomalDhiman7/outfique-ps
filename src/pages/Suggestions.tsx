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

  useEffect(() => {
    Promise.all([
      fetchWardrobeSuggestions(),
      fetchWeatherSuggestions()
    ]).finally(() => setLoading(false));
  }, []);

  const fetchWardrobeSuggestions = async () => {
    try {
      const response = await api.get('/suggestions/wardrobe');
      setWardrobeSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching wardrobe suggestions:', error);
    }
  };

  const fetchWeatherSuggestions = async () => {
    try {
      const response = await api.get('/suggestions/weather');
      setWeatherSuggestions(response.data.suggestions);
      setWeatherData(response.data.weather);
    } catch (error) {
      console.error('Error fetching weather suggestions:', error);
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
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {suggestion.occasion}
          </h3>
          <div className="flex items-center space-x-1">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round(suggestion.confidence * 100)}% match
            </span>
          </div>
        </div>

        {/* Outfit Items */}
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

        {/* Buy Links */}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Your Style Suggestions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered outfit recommendations just for you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Wardrobe Suggestions */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Shirt className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  From Your Wardrobe
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Based on your uploaded clothing items
                </p>
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
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Weather-Based
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Perfect outfits for today's weather
                </p>
              </div>
            </div>

            {/* Weather Info */}
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
                    <div className="text-blue-100 text-sm">
                      {weatherData.humidity}% humidity
                    </div>
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
                    Enable location access to get weather-based recommendations
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
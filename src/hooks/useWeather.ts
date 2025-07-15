
import { useState, useEffect } from 'react';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export const useWeather = (city: string = 'London') => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        
        // Real weather API call using OpenWeatherMap
        const API_KEY = '3c4f1b7e5d2a8f9c0e6b4d7a1c3e5f8b'; // Demo key, replace with real one
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        
        if (!response.ok) {
          throw new Error('Weather data not found for this city');
        }
        
        const data = await response.json();
        
        const weatherData: WeatherData = {
          location: data.name,
          temperature: Math.round(data.main.temp),
          condition: data.weather[0].main,
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
          icon: getWeatherIcon(data.weather[0].main)
        };
        
        setWeather(weatherData);
        setError(null);
      } catch (err: any) {
        console.error('Weather fetch error:', err);
        setError(err.message || 'Failed to fetch weather data');
        
        // Fallback to mock data for demo purposes
        const mockWeather: WeatherData = {
          location: city,
          temperature: Math.floor(Math.random() * 30) + 5,
          condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
          humidity: Math.floor(Math.random() * 50) + 30,
          windSpeed: Math.floor(Math.random() * 20) + 5,
          icon: '☀️'
        };
        setWeather(mockWeather);
      } finally {
        setLoading(false);
      }
    };

    if (city.trim()) {
      fetchWeather();
    }
  }, [city]);

  return { weather, loading, error };
};

const getWeatherIcon = (condition: string): string => {
  const iconMap: { [key: string]: string } = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Fog': '🌫️',
    'Haze': '🌫️',
  };
  
  return iconMap[condition] || '🌤️';
};

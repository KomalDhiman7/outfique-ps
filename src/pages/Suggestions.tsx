
import React, { useState } from 'react';
import { Upload, Camera, Cloud, Sun, CloudRain, Snowflake, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useWeather } from '@/hooks/useWeather';
import { useWardrobe } from '@/hooks/useWardrobe';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import { toast } from '@/hooks/use-toast';

const weatherOutfits = {
  Clear: {
    icon: <Sun className="h-6 w-6 text-yellow-500" />,
    suggestions: [
      'Light cotton t-shirt',
      'Denim shorts',
      'Sandals',
      'Sunglasses',
      'Sun hat'
    ],
    categories: ['shirt', 'shorts', 'sandals', 'dress'],
    season: 'summer'
  },
  Sunny: {
    icon: <Sun className="h-6 w-6 text-yellow-500" />,
    suggestions: [
      'Light cotton t-shirt',
      'Denim shorts',
      'Sandals',
      'Sunglasses',
      'Sun hat'
    ],
    categories: ['shirt', 'shorts', 'sandals', 'dress'],
    season: 'summer'
  },
  Clouds: {
    icon: <Cloud className="h-6 w-6 text-gray-500" />,
    suggestions: [
      'Light sweater',
      'Jeans',
      'Sneakers',
      'Light jacket',
      'Casual top'
    ],
    categories: ['sweater', 'jeans', 'sneakers', 'jacket'],
    season: 'autumn'
  },
  Cloudy: {
    icon: <Cloud className="h-6 w-6 text-gray-500" />,
    suggestions: [
      'Light sweater',
      'Jeans',
      'Sneakers',
      'Light jacket',
      'Casual top'
    ],
    categories: ['sweater', 'jeans', 'sneakers', 'jacket'],
    season: 'autumn'
  },
  Rain: {
    icon: <CloudRain className="h-6 w-6 text-blue-500" />,
    suggestions: [
      'Waterproof jacket',
      'Rain boots',
      'Umbrella',
      'Quick-dry pants',
      'Hood or cap'
    ],
    categories: ['jacket', 'boots', 'pants'],
    season: 'autumn'
  },
  Rainy: {
    icon: <CloudRain className="h-6 w-6 text-blue-500" />,
    suggestions: [
      'Waterproof jacket',
      'Rain boots',
      'Umbrella',
      'Quick-dry pants',
      'Hood or cap'
    ],
    categories: ['jacket', 'boots', 'pants'],
    season: 'autumn'
  },
  Snow: {
    icon: <Snowflake className="h-6 w-6 text-blue-300" />,
    suggestions: [
      'Heavy winter coat',
      'Warm boots',
      'Thermal wear',
      'Gloves',
      'Winter hat'
    ],
    categories: ['coat', 'boots', 'thermal', 'gloves'],
    season: 'winter'
  },
  'Partly Cloudy': {
    icon: <Cloud className="h-6 w-6 text-gray-400" />,
    suggestions: [
      'Layered outfit',
      'Light cardigan',
      'Comfortable jeans',
      'Versatile shoes',
      'Light scarf'
    ],
    categories: ['cardigan', 'jeans', 'shoes'],
    season: 'spring'
  }
};

const mockWardrobeOutfits = [
  {
    id: '1',
    name: 'Casual Friday',
    items: ['Blue jeans', 'White cotton t-shirt', 'Denim jacket', 'White sneakers'],
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=300&fit=crop'
  },
  {
    id: '2',
    name: 'Date Night',
    items: ['Black dress', 'Heels', 'Statement necklace', 'Clutch bag'],
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=300&fit=crop'
  },
  {
    id: '3',
    name: 'Work Ready',
    items: ['Blazer', 'Dress pants', 'Button-up shirt', 'Loafers'],
    image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=300&h=300&fit=crop'
  }
];

const Suggestions: React.FC = () => {
  const { user } = useAuth();
  const [city, setCity] = useState('Jalandhar');
  const [searchCity, setSearchCity] = useState('');
  const { weather, loading: weatherLoading } = useWeather(city);
  const { items: wardrobeItems, loading: wardrobeLoading, addWardrobeItem } = useWardrobe();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to your wardrobe",
        variant: "destructive",
      });
      return;
    }
    
    Array.from(files).forEach(async (file) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          // Create a default wardrobe item
          await addWardrobeItem({
            name: file.name.split('.')[0] || 'Clothing Item',
            category: 'clothing',
            season: 'all',
            image_url: e.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCitySearch = () => {
    if (searchCity.trim()) {
      setCity(searchCity.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCitySearch();
    }
  };

  const currentWeatherOutfit = weather ? weatherOutfits[weather.condition as keyof typeof weatherOutfits] : null;
  
  const getWardrobeRecommendations = () => {
    if (!currentWeatherOutfit || wardrobeItems.length === 0) {
      return [];
    }
    
    const seasonItems = wardrobeItems.filter(item => 
      item.season === currentWeatherOutfit.season || item.season === 'all'
    );
    
    const categoryItems = currentWeatherOutfit.categories.flatMap(category =>
      seasonItems.filter(item => 
        item.category.toLowerCase().includes(category) ||
        item.name.toLowerCase().includes(category)
      )
    );
    
    return categoryItems.slice(0, 5); // Limit to 5 items
  };

  const wardrobeRecommendations = getWardrobeRecommendations();

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-20 md:pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Wardrobe Suggestions */}
          <div className="space-y-6">
            {/* City Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Choose Your City</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter city name (e.g., Jalandhar)"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button onClick={handleCitySearch} size="sm">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                {city && (
                  <p className="text-sm text-muted-foreground">
                    Current city: <span className="font-medium">{city}</span>
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Your Wardrobe</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!user ? (
                  <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-muted-foreground">
                      Please sign in to access your wardrobe
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Upload Section */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        id="wardrobe-upload"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label htmlFor="wardrobe-upload" className="cursor-pointer">
                        <Camera className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Upload your wardrobe items or take photos
                        </p>
                        <Button className="mt-2" size="sm">
                          Add Items
                        </Button>
                      </label>
                    </div>

                    {/* Wardrobe Items Grid */}
                    {wardrobeLoading ? (
                      <LoadingSpinner />
                    ) : wardrobeItems.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {wardrobeItems.slice(0, 9).map((item) => (
                          <div key={item.id} className="relative">
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="aspect-square object-cover rounded-lg"
                              />
                            ) : (
                              <div className="aspect-square bg-secondary rounded-lg flex items-center justify-center">
                                <span className="text-xs text-center font-medium">
                                  {item.name}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                        <p className="text-muted-foreground">
                          No dresses in the wardrobe. Add some items to get personalized suggestions!
                        </p>
                      </div>
                    )}

                    {/* Weather-Based Wardrobe Suggestions */}
                    {wardrobeRecommendations.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="font-medium">Recommended from Your Wardrobe</h3>
                        {wardrobeRecommendations.map((item) => (
                          <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-3">
                                {item.image_url ? (
                                  <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded-lg"
                                  />
                                ) : (
                                  <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center">
                                    <span className="text-xs font-medium">{item.name}</span>
                                  </div>
                                )}
                                <div className="flex-1">
                                  <h4 className="font-medium">{item.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {item.category} • {item.season} season
                                  </p>
                                  {item.color && (
                                    <p className="text-xs text-muted-foreground">
                                      Color: {item.color}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Weather Suggestions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Cloud className="h-5 w-5" />
                  <span>Weather-Based Suggestions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {weatherLoading ? (
                  <LoadingSpinner />
                ) : weather ? (
                  <>
                    {/* Current Weather */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {currentWeatherOutfit?.icon}
                          <span className="font-medium">{weather.condition}</span>
                        </div>
                        <span className="text-2xl font-bold">{weather.temperature}°C</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {weather.location} • {weather.humidity}% humidity
                      </p>
                    </div>

                    {/* Weather-Based Outfit Suggestions */}
                    {currentWeatherOutfit && (
                      <div className="space-y-3">
                        <h3 className="font-medium">Recommended for {weather?.temperature}°C Weather</h3>
                        <div className="grid grid-cols-1 gap-2">
                          {currentWeatherOutfit.suggestions.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                            >
                              <span className="text-sm">{item}</span>
                              <Button size="sm" variant="outline">
                                Find Similar
                              </Button>
                            </div>
                          ))}
                        </div>
                        
                        {user && wardrobeRecommendations.length === 0 && wardrobeItems.length > 0 && (
                          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                              No matching items found in your wardrobe for this weather. 
                              Consider adding {currentWeatherOutfit.season} season items!
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-muted-foreground">Unable to load weather data</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suggestions;


import React, { useState } from 'react';
import { Upload, Camera, Cloud, Sun, CloudRain, Snowflake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWeather } from '@/hooks/useWeather';
import LoadingSpinner from '@/components/LoadingSpinner';
import { toast } from '@/hooks/use-toast';

const weatherOutfits = {
  Sunny: {
    icon: <Sun className="h-6 w-6 text-yellow-500" />,
    suggestions: [
      'Light cotton t-shirt',
      'Denim shorts',
      'Sandals',
      'Sunglasses',
      'Sun hat'
    ]
  },
  Cloudy: {
    icon: <Cloud className="h-6 w-6 text-gray-500" />,
    suggestions: [
      'Light sweater',
      'Jeans',
      'Sneakers',
      'Light jacket',
      'Casual top'
    ]
  },
  Rainy: {
    icon: <CloudRain className="h-6 w-6 text-blue-500" />,
    suggestions: [
      'Waterproof jacket',
      'Rain boots',
      'Umbrella',
      'Quick-dry pants',
      'Hood or cap'
    ]
  },
  'Partly Cloudy': {
    icon: <Cloud className="h-6 w-6 text-gray-400" />,
    suggestions: [
      'Layered outfit',
      'Light cardigan',
      'Comfortable jeans',
      'Versatile shoes',
      'Light scarf'
    ]
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
  const [uploadedItems, setUploadedItems] = useState<string[]>([]);
  const { weather, loading: weatherLoading } = useWeather();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setUploadedItems(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
      toast({
        title: "Items uploaded!",
        description: "Your wardrobe items have been added successfully",
      });
    }
  };

  const currentWeatherOutfit = weather ? weatherOutfits[weather.condition as keyof typeof weatherOutfits] : null;

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-20 md:pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Wardrobe Suggestions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Wardrobe-Based Suggestions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

                {/* Uploaded Items Grid */}
                {uploadedItems.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {uploadedItems.map((item, index) => (
                      <img
                        key={index}
                        src={item}
                        alt={`Uploaded item ${index + 1}`}
                        className="aspect-square object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}

                {/* Suggested Outfits */}
                <div className="space-y-4">
                  <h3 className="font-medium">Suggested Outfits</h3>
                  {mockWardrobeOutfits.map((outfit) => (
                    <Card key={outfit.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={outfit.image}
                            alt={outfit.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{outfit.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {outfit.items.join(', ')}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
                        <h3 className="font-medium">Recommended for Today</h3>
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

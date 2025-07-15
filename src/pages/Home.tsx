
import React, { useState, useEffect } from 'react';
import OutfitCard from '@/components/OutfitCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { toast } from '@/hooks/use-toast';

// Mock data for outfit posts
const mockOutfits = [
  {
    id: '1',
    user: { id: '1', username: 'fashionista_jane', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b6c10-db.jpg?w=100&h=100&fit=crop&crop=face' },
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop',
    caption: 'Perfect spring vibes! 🌸',
    likes: 127,
    comments: 23
  },
  {
    id: '2',
    user: { id: '2', username: 'style_maven', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop',
    caption: 'Casual Friday done right ✨',
    likes: 89,
    comments: 12
  },
  {
    id: '3',
    user: { id: '3', username: 'urban_chic', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
    image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=400&fit=crop',
    caption: 'Weekend mood 🌟',
    likes: 156,
    comments: 34
  }
];

const Home: React.FC = () => {
  const [outfits, setOutfits] = useState(mockOutfits);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleLike = (id: string) => {
    setOutfits(prev => prev.map(outfit => 
      outfit.id === id 
        ? { ...outfit, likes: outfit.likes + 1 }
        : outfit
    ));
  };

  const handleSave = () => {
    toast({
      title: "Saved to collection",
      description: "This outfit has been saved to your wardrobe",
    });
  };

  const handleFindSimilar = () => {
    toast({
      title: "Finding similar items...",
      description: "We're searching for similar outfits and products",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 md:pt-24 pb-20 md:pb-8">
        <LoadingSpinner className="min-h-[50vh]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-20 md:pb-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="space-y-8">
          {outfits.map((outfit) => (
            <OutfitCard
              key={outfit.id}
              {...outfit}
              onLike={() => handleLike(outfit.id)}
              onSave={handleSave}
              onFindSimilar={handleFindSimilar}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

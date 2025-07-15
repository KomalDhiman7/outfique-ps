
import React, { useState } from 'react';
import { Search as SearchIcon, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const mockSearchResults = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=300&fit=crop',
    likes: 127,
    user: 'fashionista_jane'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=300&fit=crop',
    likes: 89,
    user: 'style_maven'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=300&h=300&fit=crop',
    likes: 156,
    user: 'urban_chic'
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=300&h=300&fit=crop',
    likes: 203,
    user: 'modern_minimalist'
  }
];

const mockUsers = [
  { id: '1', username: 'fashionista_jane', displayName: 'Jane Doe', followers: '1.2k' },
  { id: '2', username: 'style_maven', displayName: 'Style Maven', followers: '856' },
  { id: '3', username: 'urban_chic', displayName: 'Urban Chic', followers: '2.1k' }
];

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'outfits' | 'users'>('outfits');

  const filteredUsers = mockUsers.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-6">
          {/* Search Header */}
          <div className="space-y-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search outfits or users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Search Type Toggle */}
            <div className="flex space-x-2">
              <Button
                variant={searchType === 'outfits' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSearchType('outfits')}
              >
                Outfits
              </Button>
              <Button
                variant={searchType === 'users' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSearchType('users')}
              >
                Users
              </Button>
            </div>
          </div>

          {/* Search Results */}
          {searchType === 'outfits' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {mockSearchResults.map((item) => (
                <Card key={item.id} className="overflow-hidden group cursor-pointer">
                  <CardContent className="p-0 relative">
                    <div className="aspect-square">
                      <img
                        src={item.image}
                        alt="Outfit"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end">
                      <div className="text-white text-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.likes} likes
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.displayName}</p>
                          <p className="text-sm text-muted-foreground">@{user.username}</p>
                          <p className="text-xs text-muted-foreground">{user.followers} followers</p>
                        </div>
                      </div>
                      <Button size="sm">Follow</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;

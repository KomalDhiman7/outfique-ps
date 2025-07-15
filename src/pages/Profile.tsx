
import React, { useState } from 'react';
import { Settings, Grid, Bookmark, Heart, Camera, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from '@/hooks/use-toast';

const mockUserPosts = [
  'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=300&h=300&fit=crop'
];

const Profile: React.FC = () => {
  const { user, logout, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || ''
  });

  const handleSaveProfile = () => {
    updateProfile(editForm);
    setIsSettingsOpen(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been saved successfully",
    });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
            <div className="relative">
              <Avatar className="h-32 w-32">
                <AvatarImage src={user.profilePicture} />
                <AvatarFallback className="text-2xl">
                  {user.displayName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-2 md:space-y-0 md:space-x-4">
                <h1 className="text-2xl font-bold">{user.displayName}</h1>
                <div className="flex space-x-2">
                  <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Settings</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {/* Profile Settings */}
                        <div className="space-y-4">
                          <h3 className="font-medium">Profile</h3>
                          <div className="space-y-2">
                            <Label htmlFor="displayName">Display Name</Label>
                            <Input
                              id="displayName"
                              value={editForm.displayName}
                              onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                              id="bio"
                              value={editForm.bio}
                              onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                              rows={3}
                            />
                          </div>
                        </div>

                        {/* Theme Settings */}
                        <div className="space-y-4">
                          <h3 className="font-medium">Appearance</h3>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {theme === 'light' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                              <span className="text-sm">Dark Mode</span>
                            </div>
                            <Switch
                              checked={theme === 'dark'}
                              onCheckedChange={toggleTheme}
                            />
                          </div>
                        </div>

                        {/* Premium Settings */}
                        {user.isPremium && (
                          <div className="space-y-4">
                            <h3 className="font-medium">Premium Features</h3>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Background Music</span>
                                <Switch />
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Ad-free Experience</span>
                                <Switch checked disabled />
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex space-x-2 pt-4">
                          <Button onClick={handleSaveProfile} className="flex-1">
                            Save Changes
                          </Button>
                          <Button variant="destructive" onClick={handleLogout}>
                            Logout
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <p className="text-muted-foreground mt-2">@{user.username}</p>
              <p className="mt-2">{user.bio}</p>

              {/* Stats */}
              <div className="flex justify-center md:justify-start space-x-8 mt-4">
                <div className="text-center">
                  <p className="font-bold">{mockUserPosts.length}</p>
                  <p className="text-sm text-muted-foreground">Posts</p>
                </div>
                <div className="text-center">
                  <p className="font-bold">1.2k</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="font-bold">856</p>
                  <p className="text-sm text-muted-foreground">Following</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Tabs */}
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="posts" className="flex items-center space-x-2">
                <Grid className="h-4 w-4" />
                <span>Posts</span>
              </TabsTrigger>
              <TabsTrigger value="saved" className="flex items-center space-x-2">
                <Bookmark className="h-4 w-4" />
                <span>Saved</span>
              </TabsTrigger>
              <TabsTrigger value="liked" className="flex items-center space-x-2">
                <Heart className="h-4 w-4" />
                <span>Liked</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="mt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {mockUserPosts.map((image, index) => (
                  <Card key={index} className="overflow-hidden aspect-square cursor-pointer group">
                    <CardContent className="p-0">
                      <img
                        src={image}
                        alt={`Post ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="saved" className="mt-6">
              <div className="text-center py-12">
                <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No saved outfits yet</p>
              </div>
            </TabsContent>

            <TabsContent value="liked" className="mt-6">
              <div className="text-center py-12">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No liked posts yet</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;

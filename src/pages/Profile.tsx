import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Grid3X3, Bookmark, Shirt, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Post, ClothingItem } from '../types';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'wardrobe'>('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [wardrobeItems, setWardrobeItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const [postsRes, savedRes, wardrobeRes] = await Promise.all([
        api.get(`/users/${user?.id}/posts`),
        api.get(`/users/${user?.id}/saved`),
        api.get(`/users/${user?.id}/wardrobe`)
      ]);
      
      setPosts(postsRes.data);
      setSavedPosts(savedRes.data);
      setWardrobeItems(wardrobeRes.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'posts', label: 'Posts', icon: Grid3X3, count: posts.length },
    { id: 'saved', label: 'Saved', icon: Bookmark, count: savedPosts.length },
    { id: 'wardrobe', label: 'Wardrobe', icon: Shirt, count: wardrobeItems.length },
  ];

  const renderTabContent = () => {
    const items = activeTab === 'posts' ? posts : 
                 activeTab === 'saved' ? savedPosts : wardrobeItems;

    if (loading) {
      return (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="md" />
        </div>
      );
    }

    if (items.length === 0) {
      const emptyMessages = {
        posts: 'No posts yet. Share your first outfit!',
        saved: 'No saved posts yet. Save outfits you love!',
        wardrobe: 'No wardrobe items yet. Start uploading your clothes!'
      };

      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 dark:bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
            {React.createElement(tabs.find(tab => tab.id === activeTab)?.icon || Grid3X3, {
              className: "w-8 h-8 text-gray-400"
            })}
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {emptyMessages[activeTab]}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item: any) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="aspect-square bg-white dark:bg-dark-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <img
              src={item.imageUrl}
              alt={activeTab === 'wardrobe' ? item.name : item.caption}
              className="w-full h-full object-cover"
            />
            {activeTab === 'wardrobe' && (
              <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {item.category}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    );
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 pt-20 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 pt-20 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.displayName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-2xl">
                    {user?.displayName?.charAt(0)}
                  </span>
                )}
              </div>
              {user?.isPremium && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Crown className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user?.displayName}
                </h1>
                {user?.isPremium && (
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Premium
                  </span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                @{user?.username}
              </p>
              {user?.bio && (
                <p className="text-gray-800 dark:text-gray-200">
                  {user.bio}
                </p>
              )}
            </div>

            {/* Settings Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Stats */}
          <div className="flex justify-around pt-6 border-t border-gray-200 dark:border-dark-600 mt-6">
            {tabs.map((tab) => (
              <div key={tab.id} className="text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {tab.count}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {tab.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-dark-600">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
                <span className="bg-gray-200 dark:bg-dark-600 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-full">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
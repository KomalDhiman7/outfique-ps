import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, User, Grid3X3 } from 'lucide-react';
import { Post, User as UserType } from '../types';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    users: UserType[];
    posts: Post[];
  }>({ users: [], posts: [] });
  const [explorePosts, setExplorePosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [exploreLoading, setExploreLoading] = useState(true);

  useEffect(() => {
    fetchExplorePosts();
  }, []);

  const fetchExplorePosts = async () => {
    try {
      const response = await api.get('/posts/explore');
      setExplorePosts(response.data);
    } catch (error) {
      console.error('Error fetching explore posts:', error);
    } finally {
      setExploreLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults({ users: [], posts: [] });
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 pt-20 pb-20 md:pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users or outfits..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-dark-600 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="mb-8">
            {loading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="md" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Users */}
                {searchResults.users.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      People
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {searchResults.users.map((user) => (
                        <motion.div
                          key={user.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white dark:bg-dark-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                              {user.avatar ? (
                                <img
                                  src={user.avatar}
                                  alt={user.displayName}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-white font-medium">
                                  {user.displayName.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                {user.displayName}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                @{user.username}
                              </p>
                              {user.bio && (
                                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                                  {user.bio}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Posts */}
                {searchResults.posts.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Grid3X3 className="w-5 h-5 mr-2" />
                      Outfits
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {searchResults.posts.map((post) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="aspect-square bg-white dark:bg-dark-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <img
                            src={post.imageUrl}
                            alt={post.caption}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {searchResults.users.length === 0 && searchResults.posts.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">
                      No results found for "{searchQuery}"
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Explore Section */}
        {!searchQuery && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Explore
            </h2>
            
            {exploreLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {exploreUnits.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="aspect-square bg-white dark:bg-dark-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer"
                  >
                    <img
                      src={post.imageUrl}
                      alt={post.caption}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
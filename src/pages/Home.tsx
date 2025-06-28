import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import PostCard from '../components/feed/PostCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Post } from '../types';
import api from '../services/api';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await api.post(`/posts/${postId}/like`);
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleSave = async (postId: string) => {
    try {
      await api.post(`/posts/${postId}/save`);
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, isSaved: !post.isSaved }
          : post
      ));
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleComment = (postId: string) => {
    // Navigate to post detail page or open comment modal
    console.log('Comment on post:', postId);
  };

  const handleFindSimilar = (postId: string) => {
    // Implement find similar functionality
    console.log('Find similar outfit for post:', postId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 pt-20 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 pt-20 pb-20 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Your Style Feed
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Discover the latest fashion inspiration
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-3 rounded-full shadow-lg"
          >
            <Plus className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Posts */}
        <div className="space-y-8">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onSave={handleSave}
              onComment={handleComment}
              onFindSimilar={handleFindSimilar}
            />
          ))}
        </div>

        {posts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No posts yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start following people or create your first post!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
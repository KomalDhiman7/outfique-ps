import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Bookmark, MoreHorizontal, Search } from 'lucide-react';
import { Post } from '../../types';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onComment: (postId: string) => void;
  onFindSimilar: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onLike, 
  onSave, 
  onComment, 
  onFindSimilar 
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
            {post.user.avatar ? (
              <img
                src={post.user.avatar}
                alt={post.user.displayName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-medium">
                {post.user.displayName.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {post.user.displayName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              @{post.user.username}
            </p>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full transition-colors"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-0 top-8 bg-white dark:bg-dark-700 rounded-lg shadow-lg border border-gray-200 dark:border-dark-600 py-1 z-10"
            >
              <button
                onClick={() => {
                  onFindSimilar(post.id);
                  setShowMenu(false);
                }}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-600 w-full text-left"
              >
                <Search className="w-4 h-4" />
                <span>Find Similar Outfit</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Image */}
      <div className="relative">
        <img
          src={post.imageUrl}
          alt={post.caption}
          className="w-full h-64 sm:h-80 object-cover"
        />
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onLike(post.id)}
              className={`flex items-center space-x-1 ${
                post.isLiked ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Heart 
                className={`w-6 h-6 ${post.isLiked ? 'fill-current' : ''}`} 
              />
              <span className="text-sm font-medium">{post.likes}</span>
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onComment(post.id)}
              className="flex items-center space-x-1 text-gray-600 dark:text-gray-400"
            >
              <MessageCircle className="w-6 h-6" />
              <span className="text-sm font-medium">{post.comments.length}</span>
            </motion.button>
          </div>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onSave(post.id)}
            className={`${
              post.isSaved ? 'text-yellow-500' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Bookmark 
              className={`w-6 h-6 ${post.isSaved ? 'fill-current' : ''}`} 
            />
          </motion.button>
        </div>

        {/* Caption */}
        <div className="text-gray-900 dark:text-white">
          <span className="font-medium">{post.user.displayName}</span>
          <span className="ml-2">{post.caption}</span>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="text-primary-600 dark:text-primary-400 text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Comments */}
        {post.comments.length > 0 && (
          <div className="mt-3 space-y-2">
            {post.comments.slice(0, 2).map((comment) => (
              <div key={comment.id} className="text-sm">
                <span className="font-medium text-gray-900 dark:text-white">
                  {comment.user.displayName}
                </span>
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {comment.content}
                </span>
              </div>
            ))}
            {post.comments.length > 2 && (
              <button
                onClick={() => onComment(post.id)}
                className="text-sm text-gray-500 dark:text-gray-400"
              >
                View all {post.comments.length} comments
              </button>
            )}
          </div>
        )}

        {/* Time */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
      </div>
    </motion.div>
  );
};

export default PostCard;
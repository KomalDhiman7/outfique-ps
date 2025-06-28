import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, UserPlus, Clock } from 'lucide-react';
import { Notification } from '../types';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      setNotifications(notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Notifications
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Stay updated with your style community
          </p>
        </div>

        {notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gray-200 dark:bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No notifications yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              When people interact with your posts, you'll see it here
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => !notification.isRead && markAsRead(notification.id)}
                className={`bg-white dark:bg-dark-800 rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow ${
                  !notification.isRead ? 'ring-2 ring-primary-200 dark:ring-primary-800' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* User Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
                    {notification.fromUser.avatar ? (
                      <img
                        src={notification.fromUser.avatar}
                        alt={notification.fromUser.displayName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-medium text-sm">
                        {notification.fromUser.displayName.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-gray-900 dark:text-white">
                          <span className="font-medium">
                            {notification.fromUser.displayName}
                          </span>{' '}
                          {notification.message}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                      
                      {/* Notification Icon */}
                      <div className="ml-3 flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>

                    {/* Unread Indicator */}
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Lightbulb, Bell, User, Shirt } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/suggestions', icon: Lightbulb, label: 'Suggestions' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-dark-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Shirt className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Outfique
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="relative group"
              >
                <motion.div
                  whileHover={{ y: -2 }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.div>
                {isActive(item.path) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* User Avatar */}
          <div className="flex items-center">
            <Link to="/profile">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.displayName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </motion.div>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-dark-900/90 backdrop-blur-xl border-t border-gray-200 dark:border-dark-700">
        <div className="flex justify-around items-center h-16 px-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center space-y-1"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-lg ${
                  isActive(item.path)
                    ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <item.icon className="w-5 h-5" />
              </motion.div>
              <span className={`text-xs font-medium ${
                isActive(item.path)
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
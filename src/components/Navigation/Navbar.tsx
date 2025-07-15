
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Lightbulb, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Lightbulb, label: 'Suggestions', path: '/suggestions' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b z-50">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="flex items-center justify-between h-16">
            <div 
              className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent cursor-pointer"
              onClick={() => navigate('/')}
            >
              Outfique
            </div>
            <div className="flex space-x-1">
              {navItems.map(({ icon: Icon, label, path }) => (
                <Button
                  key={path}
                  variant={location.pathname === path ? "default" : "ghost"}
                  size="sm"
                  onClick={() => navigate(path)}
                  className={cn(
                    "flex items-center space-x-2",
                    location.pathname === path && "bg-primary text-primary-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navbar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t z-50">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ icon: Icon, label, path }) => (
            <Button
              key={path}
              variant="ghost"
              size="sm"
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center space-y-1 p-2",
                location.pathname === path && "text-primary"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{label}</span>
            </Button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navbar;

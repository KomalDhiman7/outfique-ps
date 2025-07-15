
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio: string;
  profilePicture?: string;
  isPremium: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored auth data
    const storedUser = localStorage.getItem('outfique_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - replace with actual API call
    const mockUser: User = {
      id: '1',
      username: email.split('@')[0],
      email,
      displayName: email.split('@')[0],
      bio: 'Fashion enthusiast 👗',
      isPremium: false
    };
    
    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('outfique_user', JSON.stringify(mockUser));
    return true;
  };

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    // Mock signup - replace with actual API call
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      displayName: username,
      bio: 'New to fashion world 🌟',
      isPremium: false
    };
    
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('outfique_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('outfique_user');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('outfique_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      isAuthenticated,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

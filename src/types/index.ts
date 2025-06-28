export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  isPremium: boolean;
  theme: 'light' | 'dark';
  createdAt: string;
}

export interface ClothingItem {
  id: string;
  userId: string;
  name: string;
  category: 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessories';
  color: string;
  imageUrl: string;
  tags: string[];
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  imageUrl: string;
  caption: string;
  tags: string[];
  likes: number;
  comments: Comment[];
  saves: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  user: User;
  content: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow';
  fromUser: User;
  postId?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface OutfitSuggestion {
  id: string;
  items: ClothingItem[];
  occasion: string;
  weather?: string;
  confidence: number;
  buyLinks?: BuyLink[];
}

export interface BuyLink {
  name: string;
  url: string;
  price: string;
  imageUrl: string;
}

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

import React from 'react';
import { Heart, MessageCircle, UserPlus, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'suggestion';
  user: {
    username: string;
    avatar?: string;
  };
  message: string;
  time: string;
  isRead: boolean;
}

const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'like',
    user: { username: 'fashionista_jane', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b6c10-db.jpg?w=100&h=100&fit=crop&crop=face' },
    message: 'liked your outfit post',
    time: '2 minutes ago',
    isRead: false
  },
  {
    id: '2',
    type: 'comment',
    user: { username: 'style_maven' },
    message: 'commented on your post: "Love this color combination!"',
    time: '1 hour ago',
    isRead: false
  },
  {
    id: '3',
    type: 'follow',
    user: { username: 'urban_chic', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
    message: 'started following you',
    time: '3 hours ago',
    isRead: true
  },
  {
    id: '4',
    type: 'suggestion',
    user: { username: 'outfique_ai' },
    message: 'New outfit suggestions available based on today\'s weather',
    time: '5 hours ago',
    isRead: true
  }
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'like':
      return <Heart className="h-4 w-4 text-red-500" />;
    case 'comment':
      return <MessageCircle className="h-4 w-4 text-blue-500" />;
    case 'follow':
      return <UserPlus className="h-4 w-4 text-green-500" />;
    case 'suggestion':
      return <Lightbulb className="h-4 w-4 text-yellow-500" />;
    default:
      return null;
  }
};

const Notifications: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-20 md:pb-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Notifications</h1>
            <Button variant="outline" size="sm">
              Mark all as read
            </Button>
          </div>

          <div className="space-y-2">
            {mockNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  !notification.isRead ? 'border-primary/50 bg-primary/5' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={notification.user.avatar} />
                      <AvatarFallback>
                        {notification.user.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        {getNotificationIcon(notification.type)}
                        <p className="text-sm">
                          <span className="font-medium">{notification.user.username}</span>{' '}
                          {notification.message}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.time}
                      </p>
                    </div>

                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;

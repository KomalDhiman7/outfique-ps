
import React, { useState } from 'react';
import { Heart, MessageCircle, Bookmark, MoreHorizontal, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface OutfitCardProps {
  id: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
  image: string;
  caption?: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  isSaved?: boolean;
  onLike?: () => void;
  onComment?: () => void;
  onSave?: () => void;
  onFindSimilar?: () => void;
}

const OutfitCard: React.FC<OutfitCardProps> = ({
  user,
  image,
  caption,
  likes,
  comments,
  isLiked = false,
  isSaved = false,
  onLike,
  onComment,
  onSave,
  onFindSimilar
}) => {
  const [liked, setLiked] = useState(isLiked);
  const [saved, setSaved] = useState(isSaved);

  const handleLike = () => {
    setLiked(!liked);
    onLike?.();
  };

  const handleSave = () => {
    setSaved(!saved);
    onSave?.();
  };

  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden">
      <CardContent className="p-0">
        {/* User Header */}
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm">{user.username}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onFindSimilar}>
                <ShoppingBag className="h-4 w-4 mr-2" />
                Find Similar Outfit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Image */}
        <div className="aspect-square relative">
          <img
            src={image}
            alt="Outfit"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Actions */}
        <div className="p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className="p-0 h-auto"
              >
                <Heart 
                  className={`h-5 w-5 ${liked ? 'fill-red-500 text-red-500' : ''}`} 
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onComment}
                className="p-0 h-auto"
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="p-0 h-auto"
            >
              <Bookmark 
                className={`h-5 w-5 ${saved ? 'fill-current' : ''}`} 
              />
            </Button>
          </div>

          {/* Likes */}
          <p className="text-sm font-medium">{likes} likes</p>

          {/* Caption */}
          {caption && (
            <p className="text-sm">
              <span className="font-medium">{user.username}</span> {caption}
            </p>
          )}

          {/* Comments */}
          {comments > 0 && (
            <Button variant="link" className="text-sm text-muted-foreground p-0 h-auto">
              View all {comments} comments
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OutfitCard;

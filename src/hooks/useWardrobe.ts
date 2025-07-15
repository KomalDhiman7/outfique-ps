import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface WardrobeItem {
  id: string;
  user_id: string;
  name: string;
  category: string;
  color?: string;
  season: 'summer' | 'winter' | 'spring' | 'autumn' | 'all';
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export const useWardrobe = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWardrobeItems = async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wardrobe_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems((data || []) as WardrobeItem[]);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching wardrobe items:', err);
    } finally {
      setLoading(false);
    }
  };

  const addWardrobeItem = async (item: Omit<WardrobeItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to your wardrobe",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('wardrobe_items')
        .insert({
          ...item,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setItems(prev => [data as WardrobeItem, ...prev]);
      toast({
        title: "Item added!",
        description: "Your wardrobe item has been added successfully",
      });
      return data;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error adding item",
        description: err.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteWardrobeItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('wardrobe_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setItems(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Item removed",
        description: "Item has been removed from your wardrobe",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error removing item",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const getItemsBySeason = (season: string) => {
    return items.filter(item => 
      item.season === season || item.season === 'all'
    );
  };

  const getItemsByCategory = (category: string) => {
    return items.filter(item => 
      item.category.toLowerCase().includes(category.toLowerCase())
    );
  };

  useEffect(() => {
    fetchWardrobeItems();
  }, [user]);

  return {
    items,
    loading,
    error,
    addWardrobeItem,
    deleteWardrobeItem,
    getItemsBySeason,
    getItemsByCategory,
    refetch: fetchWardrobeItems,
  };
};
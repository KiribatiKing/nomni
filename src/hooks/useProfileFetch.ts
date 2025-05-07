
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { User } from '@/types';
import { toast } from "@/components/ui/use-toast";

export const useProfileFetch = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserProfile = async (userId: string): Promise<User | null> => {
    setIsLoading(true);
    console.log("Fetching profile for user:", userId);
    
    try {
      // Small delay to ensure the profile has been created
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error("Error fetching profile:", error);
        toast({
          variant: "destructive",
          title: "Error loading profile",
          description: "There was a problem loading your profile."
        });
        return null;
      } 
      
      if (data) {
        console.log("Profile fetched successfully:", data);
        return {
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role,
          profilePicture: data.profile_picture || undefined,
          createdAt: data.created_at,
          subscriptionTier: data.subscription_tier as 'basic' | 'premium' | null,
        };
      } 
      
      console.log("No profile data found");
      return null;
    } catch (err) {
      console.error("Unexpected error fetching profile:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchUserProfile,
    isLoading
  };
};

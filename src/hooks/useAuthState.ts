
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { authService } from "@/services/authService";
import { useProfileFetch } from "@/hooks/useProfileFetch";

export const useAuthState = () => {
  const [session, setSession] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchUserProfile } = useProfileFetch();

  // Handle profile fetching
  const handleProfileFetch = async (userId: string) => {
    setIsLoading(true);
    try {
      const profile = await fetchUserProfile(userId);
      setCurrentUser(profile);
    } finally {
      setIsLoading(false);
    }
  };

  // Setup auth listener
  useEffect(() => {
    console.log("Setting up auth listener");
    
    // Subscribe to session events
    const { data: { subscription } } = authService.onAuthStateChange((session) => {
      setSession(session);
      
      // Use setTimeout to prevent potential deadlock with Supabase auth
      if (session?.user?.id) {
        setIsLoading(true); // Ensure loading state is active
        setTimeout(() => {
          handleProfileFetch(session.user.id);
        }, 0);
      } else {
        setCurrentUser(null);
        setIsLoading(false);
      }
    });

    // On mount, get session
    const initializeAuth = async () => {
      try {
        const session = await authService.getSession();
        console.log("Got initial session:", session?.user?.id);
        setSession(session);
        
        if (session?.user?.id) {
          await handleProfileFetch(session.user.id);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
        setIsLoading(false);
      }
    };
    
    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    currentUser, 
    isLoading,
    setCurrentUser
  };
};

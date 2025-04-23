import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { UserRole, User } from '@/types';
import { toast } from "@/components/ui/use-toast";

// AuthContext definition
interface AuthContextType {
  session: any;
  currentUser: User | null;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  currentUser: null,
  isAuthenticated: false,
  userRole: null,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  isLoading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen to auth state + fetch profile
  useEffect(() => {
    console.log("Setting up auth listener");
    
    // Subscribe to session events (do this first)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session?.user?.id);
      setSession(session);
      
      if (session?.user?.id) {
        // Use setTimeout to prevent potential deadlock with Supabase auth
        setTimeout(() => {
          fetchUserProfile(session.user.id);
        }, 0);
      } else {
        setCurrentUser(null);
        setIsLoading(false);
      }
    });

    // On mount, get session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Got initial session:", session?.user?.id);
      setSession(session);
      if (session?.user?.id) {
        fetchUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user profile from Supabase
  const fetchUserProfile = async (userId: string) => {
    setIsLoading(true);
    console.log("Fetching profile for user:", userId);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error("Error fetching profile:", error);
        setCurrentUser(null);
      } else if (data) {
        console.log("Profile fetched successfully:", data);
        setCurrentUser({
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role,
          profilePicture: data.profile_picture || undefined,
          createdAt: data.created_at,
          subscriptionTier: data.subscription_tier as 'basic' | 'premium' | null,
        });
      } else {
        console.log("No profile data found");
        setCurrentUser(null);
      }
    } catch (err) {
      console.error("Unexpected error fetching profile:", err);
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Login
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Attempting login for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Login error:", error);
        throw new Error(error.message);
      }
      
      console.log("Login successful for:", data.user?.email);
      // Session will be set by onAuthStateChange
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    try {
      console.log("Attempting signup for:", email, "with role:", role);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          }
        }
      });
      
      if (error) {
        console.error("Signup error:", error);
        throw new Error(error.message);
      }
      
      if (data?.user) {
        console.log("Signup successful for:", data.user.email);
        toast({
          title: "Account created",
          description: "Please check your email to confirm your account.",
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      setIsLoading(false);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    setIsLoading(true);
    try {
      console.log("Attempting logout");
      await supabase.auth.signOut();
      setSession(null);
      setCurrentUser(null);
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "There was an error during logout. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    session,
    currentUser,
    isAuthenticated: !!currentUser,
    userRole: currentUser?.role || null,
    login,
    signup,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
